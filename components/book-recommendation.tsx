"use client";

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { BookCard } from "./book-card";
import { Textarea } from "./ui/textarea";
import { Loader } from "./loader";
import { Toaster } from "./ui/sonner";

export function BookRecommendationChat() {
  const [books, setBooks] = useState<
    {
      name: string;
      author_name: string;
      coverId: string;
      amazonIds: string[];
    }[]
  >([]);
  const [booksName, setBooksName] = useState<string[]>([]);
  const [mood, setMood] = useState<string>("");
  const { visibleMessages, appendMessage, isLoading } = useCopilotChat();
  const [loadingState, setLoadingState] = useState<string>("not-loaded");
  const sendMessage = (content: string) => {
    appendMessage(
      new TextMessage({
        content: `Provide a JSON array object of 8 unique book recommendations published after 2000, with the key "recommendation" in this format {"recommendation":["nameofthebook(short names)","nameofthebook(short names)"]}. E${booksName.length > 0 ? `Exclude any books in the provided list: [${booksName.join(", ")}]` : ""}. Only include book titles, and ensure selections match the mood and style in the following text: '${content}'. `,
        role: Role.User,
      }),
    );
    setLoadingState("loading");
  };
  const handleInput = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      if (mood) sendMessage(mood);
    }
  };
  const handleInputChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    const content = event.target.value;
    if (content) {
      setMood(content);
    }
  };
  const fetchBooks = async (data: string[]) => {
    const books = [];
    for (let i = 0; i < data.length; i++) {
      const bookName = data[i].replaceAll(" ", "+");
      const response = await fetch(
        `https://openlibrary.org/search.json?title=${bookName}`,
      );
      const content = await response.json();
      let book = content.docs.filter((doc: { title: string }) =>
        doc.title.includes(data[i]),
      );
      if (book.length === 0 || !book[0].title) book = [{ ...content.docs[0] }];
      console.log(book);
      const bookObject = {
        name: book[0].title ?? data[i],
        coverId: book[0].cover_i,
        author_name: book[0].author_name,
        amazonIds: book[0].id_amazon,
      };
      books.push(bookObject);
    }

    setBooks([...books]);
    setLoadingState("loaded");
  };
  useEffect(() => {
    const messages = visibleMessages
      .filter((message) =>
        message.isTextMessage() && message.role === "assistant"
          ? message
          : null,
      )
      .sort((messageA, messageB) => messageB.createdAt - messageA.createdAt);

    const message = messages.length > 0 ? messages[0] : null;
    if (
      message &&
      message.isTextMessage() &&
      message.content.lastIndexOf("}") !== -1
    ) {
      const content = message.content;
      let jsonString = content.substring(content.lastIndexOf("{"));
      jsonString = jsonString.substring(0, jsonString.lastIndexOf("}") + 1);
      console.log(jsonString);
      const data = JSON.parse(jsonString);
      setBooksName([...data.recommendation]);
      fetchBooks(data.recommendation);
    }
  }, [visibleMessages]);
  return (
    <section className="flex flex-col gap-5">
      <section className="flex gap-2 flex-col">
        <Textarea
          onKeyDown={handleInput}
          onChange={handleInputChange}
          placeholder="Describe your mood"
          disabled={isLoading}
        />
        <Button
          onClick={() => {
            sendMessage(mood);
          }}
          disabled={isLoading}
        >
          Submit
        </Button>
      </section>
      <div className="flex flex-wrap items-center mx-auto w-fit gap-2">
        {loadingState === "loading" && <Loader />}
        {loadingState === "loaded" &&
          books?.map((book) => (
            <BookCard
              key={book.coverId}
              title={book.name}
              author={book.author_name}
              coverUrl={`https://covers.openlibrary.org/b/id/${book.coverId}-L.jpg`}
              altText={`${book.name}-image`}
              amazonIds={book.amazonIds}
            />
          ))}
      </div>
      <Toaster />
    </section>
  );
}
