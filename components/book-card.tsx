"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import Image from "next/image";

interface BookCardProps {
  title: string;
  author: string;
  coverUrl: string;
  altText: string;
}

export function BookCard({
  title,
  author,
  coverUrl,
  altText,
}: Partial<BookCardProps>) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Card
      className="w-full max-w-xs overflow-hidden transition-all duration-300 ease-in-out transform hover:scale-105 hover:shadow-xl"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        backgroundImage:
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      }}
    >
      <div className="relative h-96 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 transition-opacity duration-300"
          style={{ opacity: isHovered ? 0.7 : 0.5 }}
        />
        <img
          src={coverUrl ?? ""}
          alt={altText ?? ""}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h2
            className="text-3xl font-bold mb-2 line-clamp-2 font-serif"
            style={{
              textShadow: "2px 2px 4px rgba(0,0,0,0.5)",
            }}
          >
            {title}
          </h2>
          <p className="text-lg opacity-90 font-medium">by {author}</p>
        </div>
      </div>
    </Card>
  );
}
