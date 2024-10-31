"use client";

import { useCopilotChat } from "@copilotkit/react-core";
import { Role, TextMessage } from "@copilotkit/runtime-client-gql";
import { ChangeEvent, KeyboardEvent, useEffect, useState } from "react";
import { Button } from "./ui/button";
import { BookCard } from "./book-card";
import { Textarea } from "./ui/textarea";
import { Loader } from "./loader";

export function BookRecommendationChat() {
  const [books, setBooks] = useState<
    { name: string; author_name: string; coverId: string }[]
  >([]);
  const [mood, setMood] = useState<string>("");
  const { visibleMessages, appendMessage, isLoading } = useCopilotChat();
  const [loadingState, setLoadingState] = useState<string>("not-loaded");
  const sendMessage = (content: string) => {
    appendMessage(
      new TextMessage({
        content: `Recommend 8 best random books with their names only in a json format with recommendation as the key (don't include the markdown format) if a person has the moods described here:${content}`,
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
      const bookObject = {
        name: content.docs[0].title,
        coverId: content.docs[0].cover_i,
        author_name: content.docs[0].author_name,
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
      message.content.lastIndexOf("```") !== 0 &&
      message.content.lastIndexOf("```") !== -1
    ) {
      const content = message.content;
      let jsonString = content.substring(7);
      jsonString = jsonString.substring(0, jsonString.length - 5);
      const data = JSON.parse(jsonString);

      fetchBooks(data.recommendation);
    }
  }, [visibleMessages]);
  console.log(loadingState);
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
            />
          ))}
      </div>
    </section>
  );
}