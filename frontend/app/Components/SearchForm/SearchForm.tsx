"use client";

import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupButton,
} from "@/components/ui/input-group";

interface SearchFormProps {
  onChange: (q: string) => void;
}

export default function SearchForm({ onChange }: SearchFormProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onChange(query);
  };
  return (
    <div className="flex w-full items-center gap-4">
      <InputGroup className="flex-1 h-[40px] px-3 py-2 bg-transparent border border-gray-300 rounded-[12px] hover:border-accent focus-within:border-accent transition-colors">
        <InputGroupInput
          placeholder="Find a task..."
          className="text-base md:text-base border-none focus-visible:ring-0"
          onChange={handleChange}
        />
        <InputGroupAddon align="inline-start">
          <SearchIcon className="h-5 w-5 text-gray-500" />
        </InputGroupAddon>
      </InputGroup>

      {/* <InputGroupButton 
        className="flex items-center justify-center border-none cursor-pointer h-[44px] px-8 rounded-[60px] bg-accent text-base text-white font-normal transition-opacity duration-300 ease-in-out hover:bg-accent hover:text-white hover:opacity-90"
      >
        Search
      </InputGroupButton>       */}
    </div>
  );
}
