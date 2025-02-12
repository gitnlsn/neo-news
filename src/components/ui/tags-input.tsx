"use client";

import { X } from "lucide-react";
import * as React from "react";
import { Badge } from "~/components/ui/badge";
import { Input } from "~/components/ui/input";
import { cn } from "~/lib/utils";

export interface Tag {
  name: string;
}

interface TagsInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  tags: Tag[];
  onTagsChange: (tags: Tag[]) => void;
  placeholder?: string;
  className?: string;
}

export const TagsInput = React.forwardRef<HTMLInputElement, TagsInputProps>(
  (
    { tags, onTagsChange, placeholder = "Add tag...", className, id, ...props },
    ref,
  ) => {
    const [inputValue, setInputValue] = React.useState("");
    const inputRef = React.useRef<HTMLInputElement>(null);
    const inputId = id || React.useId();

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === "Enter" && inputValue) {
        e.preventDefault();
        if (
          !tags.some(
            (tag) => tag.name.toLowerCase() === inputValue.toLowerCase(),
          )
        ) {
          onTagsChange([...tags, { name: inputValue.trim() }]);
        }
        setInputValue("");
      } else if (e.key === "Backspace" && !inputValue && tags.length > 0) {
        onTagsChange(tags.slice(0, -1));
      }
    };

    const handleRemoveTag = (indexToRemove: number) => {
      onTagsChange(tags.filter((_, index) => index !== indexToRemove));
    };

    return (
      <label
        htmlFor={inputId}
        className={cn(
          "flex min-h-10 w-full cursor-text flex-wrap items-center gap-1.5 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
          className,
        )}
      >
        <div className="flex flex-wrap gap-1.5">
          {tags.map((tag, index) => (
            <Badge
              key={`${tag.name}-${index}`}
              variant="secondary"
              className="gap-1 hover:bg-secondary/80"
            >
              {tag.name}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveTag(index);
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleRemoveTag(index);
                  }
                }}
                className="ml-1 rounded-full p-0.5 hover:bg-secondary-foreground/20"
                aria-label={`Remove ${tag.name} tag`}
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ""}
          className="flex-1 bg-transparent outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          {...props}
        />
      </label>
    );
  },
);

TagsInput.displayName = "TagsInput";
