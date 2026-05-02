import { useState, useRef } from "react";
import { Phone } from "@/data/phones";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface Props {
  phones: Phone[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  placeholder?: string;
}

export default function SearchablePhoneSelect({ phones, selectedId, onSelect, placeholder = "Select phone..." }: Props) {
  const [open, setOpen] = useState(false);

  const selectedPhone = selectedId ? phones.find(p => p.id === selectedId) : null;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between bg-background border-border hover:bg-muted/50 hover:text-foreground h-12"
        >
          {selectedPhone ? (
            <span className="truncate">{selectedPhone.brand} {selectedPhone.name}</span>
          ) : (
            <span className="text-muted-foreground">{placeholder}</span>
          )}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-border bg-card">
        <Command className="bg-transparent">
          <CommandInput placeholder="Search devices..." className="border-none focus:ring-0" />
          <CommandList>
            <CommandEmpty>No phone found.</CommandEmpty>
            <CommandGroup>
              {phones.map((phone) => (
                <CommandItem
                  key={phone.id}
                  value={`${phone.brand} ${phone.name}`}
                  onSelect={() => {
                    onSelect(phone.id === selectedId ? null : phone.id);
                    setOpen(false);
                  }}
                  className="cursor-pointer hover:bg-primary/10 hover:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      selectedId === phone.id ? "opacity-100 text-primary" : "opacity-0"
                    )}
                  />
                  {phone.brand} {phone.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
