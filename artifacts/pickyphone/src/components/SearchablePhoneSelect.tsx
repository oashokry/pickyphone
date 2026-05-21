import { useState } from "react";
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
import { useLanguage } from "@/context/LanguageContext";

interface Props {
  phones: Phone[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  placeholder?: string;
}

export default function SearchablePhoneSelect({ phones, selectedId, onSelect, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const { t } = useLanguage();
  const effectivePlaceholder = placeholder ?? t.selectPhone;

  const selectedPhone = selectedId ? phones.find(p => p.id === selectedId) : null;

  const byBrand = phones.reduce<Record<string, Phone[]>>((acc, phone) => {
    if (!acc[phone.brand]) acc[phone.brand] = [];
    acc[phone.brand].push(phone);
    return acc;
  }, {});

  const sortedBrands = Object.keys(byBrand).sort();

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          data-testid="select-phone-trigger"
          className="w-full justify-between bg-background border-border hover:bg-muted/50 hover:text-foreground h-12"
        >
          {selectedPhone ? (
            <span className="truncate">{selectedPhone.brand} {selectedPhone.name} <span className="text-muted-foreground text-xs">({selectedPhone.year})</span></span>
          ) : (
            <span className="text-muted-foreground">{effectivePlaceholder}</span>
          )}
          <ChevronsUpDown className="ms-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 border-border bg-card max-h-[420px] overflow-hidden">
        <Command className="bg-transparent">
          <CommandInput placeholder={t.searchBrandModelPlaceholder} className="border-none focus:ring-0" />
          <CommandList className="max-h-[360px]">
            <CommandEmpty>{t.noPhoneFound}</CommandEmpty>
            {sortedBrands.map((brand) => (
              <CommandGroup key={brand} heading={<span className="text-primary/70 text-xs font-bold tracking-widest uppercase">{brand}</span>}>
                {byBrand[brand]
                  .sort((a, b) => b.year - a.year)
                  .map((phone) => (
                    <CommandItem
                      key={phone.id}
                      value={`${phone.brand} ${phone.name} ${phone.year}`}
                      onSelect={() => {
                        onSelect(phone.id === selectedId ? null : phone.id);
                        setOpen(false);
                      }}
                      className="cursor-pointer hover:bg-primary/10 hover:text-primary data-[selected=true]:bg-primary/10 data-[selected=true]:text-primary"
                      data-testid={`phone-option-${phone.id}`}
                    >
                      <Check
                        className={cn(
                          "me-2 h-4 w-4 shrink-0",
                          selectedId === phone.id ? "opacity-100 text-primary" : "opacity-0"
                        )}
                      />
                      <span className="flex-1 truncate">{phone.name}</span>
                      <span className="ms-2 text-xs text-muted-foreground shrink-0">{phone.year} · ${phone.price}</span>
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
