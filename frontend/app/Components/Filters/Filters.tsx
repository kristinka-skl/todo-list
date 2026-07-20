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
  onStatusFilterChange: (s: string | undefined) => void;
  onSortingOrderChange: (o: string | undefined) => void;
}

export default function Filters({
  onSearchChange,
  onStatusFilterChange,
  onSortingOrderChange,
}: SearchFormProps) {
  const handleSortingChange = (value: string) => {
    onSortingOrderChange(value !== 'none' ? value : undefined);
  };

  const handleStatusFilter = (value: string) => {
    onStatusFilterChange(value !== 'all' ? value : undefined);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    onSearchChange(query);
  };

  const itemClasses = "focus:outline-none focus:ring-0 focus:border-transparent border-transparent cursor-pointer";

  return (
    <div className="flex w-full items-center gap-4">
      <FieldSet className="flex flex-col md:flex-row gap-4 w-full">
        <div className="flex flex-row gap-4">
          <Field className="w-[72px] hover:border-accent focus-within:border-accent transition-colors">
            <FieldLabel className="px-1" htmlFor="form-priority">
              Priority
            </FieldLabel>
            <Select onValueChange={handleSortingChange}>
              <SelectTrigger id="form-priority">
                <SelectValue placeholder="-" />
              </SelectTrigger>
              <SelectContent className="min-w-[72px] w-[72px]">
                <SelectItem value="none" className={itemClasses}>none</SelectItem>               
                <SelectItem value="ascending" className={itemClasses}>asc</SelectItem>
                <SelectItem value="descending" className={itemClasses}>des</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          <Field className="w-[88px]">
            <FieldLabel className="px-1" htmlFor="form-status">
              Status
            </FieldLabel>
            <Select defaultValue="all" onValueChange={handleStatusFilter}>
              <SelectTrigger id="form-status">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="min-w-[88px] w-[88px]">
                <SelectItem value="all" className={itemClasses}>all</SelectItem>
                <SelectItem value="done" className={itemClasses}>done</SelectItem>
                <SelectItem value="undone" className={itemClasses}>undone</SelectItem>
              </SelectContent>
            </Select>
          </Field>
        </div>

        <Field className="flex-1 w-full">
          <FieldLabel className="px-1" htmlFor="form-search">
            Search
          </FieldLabel>
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