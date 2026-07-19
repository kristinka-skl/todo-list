"use client";

import { SearchIcon } from "lucide-react";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";

import { Field, FieldLabel, FieldSet } from "@/components/ui/field";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchFormProps {
  onSearchChange: (q: string) => void;
  onStatusFilterChange: (s: string) => void;
}

export default function Filters({ onSearchChange, onStatusFilterChange }: SearchFormProps) {
const handleStatusFilter = (value?: string | undefined) => {    
  onStatusFilterChange(value || "all");
}

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearchChange(query);
  };

  return (
    <div className="flex w-full items-center gap-4">
      
      <FieldSet className="flex flex-col md:flex-row gap-4 w-full">
        
        <div className="flex flex-row gap-4">
          <Field className="w-[72px] hover:border-accent focus-within:border-accent transition-colors">
            <FieldLabel className="px-1" htmlFor="form-priority">Priority</FieldLabel>
            <Select defaultValue="1">
              <SelectTrigger id="form-priority">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[72px] w-[72px]">
                <SelectItem value="ascending">asc</SelectItem>
                <SelectItem value="descending">des</SelectItem>
              </SelectContent>
            </Select>
          </Field>
          
          <Field className="w-[88px]">
            <FieldLabel className="px-1" htmlFor="form-status">Status</FieldLabel>
            <Select defaultValue="all" onValueChange={handleStatusFilter}>
              <SelectTrigger id="form-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[88px] w-[88px]">
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="done">Done</SelectItem>
                <SelectItem value="undone">Undone</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>
      
        <Field className="flex-1 w-full">
          <FieldLabel className="px-1" htmlFor="form-search">Search</FieldLabel>
          <InputGroup className="bg-transparent border border-gray-300 rounded-[12px] hover:border-accent focus-within:border-accent transition-colors w-full">
            <InputGroupInput
              id="form-search"
              placeholder="Find a task..."
              className="text-base md:text-base border-none focus-visible:ring-0"
              onChange={handleSearchChange}
            />
            <InputGroupAddon align="inline-start">
              <SearchIcon className="h-5 w-5 text-gray-500" />
            </InputGroupAddon>
          </InputGroup>
        </Field>

      </FieldSet>
    </div>
  );
}