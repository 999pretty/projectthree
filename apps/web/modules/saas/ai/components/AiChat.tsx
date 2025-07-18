"use client";

import { useCallback, useEffect, useMemo } from "react";
import { useFormatter } from "next-intl";
import { EllipsisIcon, PlusIcon, SendIcon } from "lucide-react";
import { useQueryState } from "nuqs";
import { type Message, useChat } from "@ai-sdk/react";
import { useQueryClient } from "@tanstack/react-query";

import {
	aiChatListQueryKey,
	useAiChatListQuery,
	useAiChatQuery,
	useCreateAiChatMutation,
} from "@saas/ai/lib/api";
import { SidebarContentLayout } from "@saas/shared/components/SidebarContentLayout";
import { Button } from "@ui/components/button";
import { Textarea } from "@ui/components/textarea";
import { cn } from "@ui/lib";

export const AiChat = ({
	organizationId,
}: Readonly<{ organizationId?: string }>) => {
	const formatter = useFormatter();
	const queryClient = useQueryClient();
	const { data: chats, status: chatsStatus } =
		useAiChatListQuery(organizationId);
	const [chatId, setChatId] = useQueryState("chatId");
	const { data: currentChat } = useAiChatQuery(chatId ?? "new");
	const createChatMutation = useCreateAiChatMutation();
	const {
		messages,
		input,
		handleInputChange,
		handleSubmit,
		status,
		setMessages,
	} = useChat({
		api: `/api/ai/chats/${chatId}/messages`,
		credentials: "include",
		initialMessages: [],
	});

	useEffect(() => {
		if (currentChat?.messages?.length) {
			setMessages(currentChat.messages as unknown as Message[]);
		}
	}, [currentChat, setMessages]);

	const createNewChat = useCallback(async () => {
		const newChat = await createChatMutation.mutateAsync({
			organizationId,
		});
		await queryClient.invalidateQueries({
			queryKey: aiChatListQueryKey(organizationId),
		});
		setChatId(newChat.id);
	}, [createChatMutation, organizationId, queryClient, setChatId]);

	useEffect(() => {
		(async () => {
			if (chatId || chatsStatus !== "success") {
				return;
			}

			if (chats?.length) {
				setChatId(chats[0].id);
				setMessages(chats[0].messages as unknown as Message[]);
			} else {
				await createNewChat();
				setMessages([]);
			}
		})();
	}, [chatId, chats, chatsStatus, createNewChat, setChatId, setMessages]);

	const hasChat =
		chatsStatus === "success" && !!chats?.length && !!currentChat?.id;

	const sortedChats = useMemo(() => {
		return (
			chats?.sort(
				(a, b) =>
					new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
			) ?? []
		);
	}, [chats]);

	return (
		<SidebarContentLayout
			sidebar={
				<div>
					<Button
						className="mb-4 flex w-full items-center gap-2"
						loading={createChatMutation.isPending}
						size="sm"
						variant="light"
						onClick={createNewChat}
					>
						<PlusIcon className="size-4" />
						New chat
					</Button>

					{sortedChats.map((chat) => (
						<div key={chat.id} className="relative">
							<Button
								className={cn(
									"block h-auto w-full py-2 text-left text-foreground hover:no-underline",
									chat.id === chatId && "bg-primary/10 font-bold text-primary",
								)}
								variant="link"
								onClick={() => setChatId(chat.id)}
							>
								<span className="w-full overflow-hidden">
									<span className="block truncate">
										{chat.title ??
											chat.messages?.at(0)?.content ??
											"Untitled chat"}
									</span>
									<small className="block font-normal">
										{formatter.dateTime(new Date(chat.createdAt), {
											dateStyle: "short",
											timeStyle: "short",
										})}
									</small>
								</span>
							</Button>
						</div>
					))}
				</div>
			}
		>
			<div className="-mt-8 flex h-[calc(100vh-10rem)] flex-col">
				<div className="flex flex-1 flex-col gap-2 overflow-y-auto py-8">
					{messages.map((message: Message, index: number) => (
						<div
							key={message.id ?? `message-${index}`}
							className={cn(
								"flex flex-col gap-2",
								message.role === "user" ? "items-end" : "items-start",
							)}
						>
							<div
								className={cn(
									"flex max-w-2xl items-center gap-2 whitespace-pre-wrap rounded-lg px-4 py-2 text-foreground",
									message.role === "user" ? "bg-primary/10" : "bg-secondary/10",
								)}
							>
								{message.content}
							</div>
						</div>
					))}

					{status === "streaming" ? (
						<div className="flex justify-start">
							<div className="flex max-w-2xl items-center gap-2 rounded-lg bg-secondary/10 px-4 py-2 text-foreground">
								<EllipsisIcon className="size-6 animate-pulse" />
							</div>
						</div>
					) : null}
				</div>

				<form
					className="relative shrink-0 rounded-lg border-none bg-card py-6 pr-14 pl-6 text-lg shadow-sm focus:outline-hidden focus-visible:ring-0"
					onSubmit={handleSubmit}
				>
					<Textarea
						className="min-h-8 rounded-none border-none bg-transparent p-0 shadow-none focus:outline-hidden focus-visible:ring-0"
						disabled={!hasChat}
						placeholder="Chat with your AI..."
						value={input}
						onChange={handleInputChange}
						onKeyDown={(e) => {
							if (e.key === "Enter" && !e.shiftKey) {
								e.preventDefault();
								handleSubmit(e);
							}
						}}
					/>

					<Button
						className="absolute right-3 bottom-3"
						disabled={!hasChat}
						size="icon"
						type="submit"
						variant="secondary"
					>
						<SendIcon className="size-4" />
					</Button>
				</form>
			</div>
		</SidebarContentLayout>
	);
};
