import { Phone } from "@/data/phones";
import SpecRow from "./SpecRow";

interface Props {
  phone: Phone;
  winners: {
    price: string;
    displayScore: string;
    cameraScore: string;
    performanceScore: string;
    batteryScore: string;
  };
}

export default function PhoneCard({ phone, winners }: Props) {
  return (
    <div className="flex flex-col bg-card rounded-2xl border border-border shadow-lg hover:border-primary/30 transition-colors duration-500 overflow-hidden">
      
      {/* Header / Image */}
      <div className="p-6 pb-0 flex flex-col items-center text-center">
        <div className="w-full aspect-[2/3] max-h-64 mb-6 relative flex items-center justify-center px-4">
          <div className="absolute inset-0 bg-gradient-to-b from-background to-transparent opacity-50 rounded-xl" />
          <img src={phone.imageUrl} alt={phone.name} className="h-full object-contain relative z-10 drop-shadow-2xl" />
        </div>
        
        <span className="text-xs font-bold tracking-[0.2em] text-muted-foreground uppercase mb-2">{phone.brand}</span>
        <h3 className="text-2xl font-serif font-bold mb-2">{phone.name}</h3>
        <p className="text-xl font-light mb-6 text-foreground/80">${phone.price}</p>
        
        <div className="flex gap-2 mb-8">
          {phone.colors.map(color => (
            <div 
              key={color.hex} 
              title={color.name}
              className="w-4 h-4 rounded-full border border-border ring-1 ring-background"
              style={{ backgroundColor: color.hex }}
            />
          ))}
        </div>
      </div>

      {/* Specs */}
      <div className="p-6 bg-background/50 flex-1 flex flex-col gap-8 text-left border-t border-border/50">
        
        <div>
          <h4 className="text-sm font-serif font-bold text-primary mb-2 border-b border-primary/20 pb-2">Display</h4>
          <SpecRow label="Size" value={phone.display.size} />
          <SpecRow label="Resolution" value={phone.display.resolution} />
          <SpecRow label="Type" value={phone.display.type} />
          <SpecRow label="Refresh Rate" value={phone.display.refreshRate} />
          <SpecRow label="Quality Score" value={`${phone.displayScore}/100`} isWinner={winners.displayScore === phone.id} />
        </div>

        <div>
          <h4 className="text-sm font-serif font-bold text-primary mb-2 border-b border-primary/20 pb-2">Performance</h4>
          <SpecRow label="Chipset" value={phone.performance.chipset} />
          <SpecRow label="RAM" value={phone.performance.ram} />
          <SpecRow label="Power Score" value={`${phone.performance.score}/100`} isWinner={winners.performanceScore === phone.id} />
        </div>

        <div>
          <h4 className="text-sm font-serif font-bold text-primary mb-2 border-b border-primary/20 pb-2">Camera</h4>
          <SpecRow label="Main" value={phone.camera.main} />
          <SpecRow label="Ultrawide" value={phone.camera.ultrawide} />
          <SpecRow label="Telephoto" value={phone.camera.telephoto} />
          <SpecRow label="Video" value={phone.camera.video} />
          <SpecRow label="Optics Score" value={`${phone.camera.score}/100`} isWinner={winners.cameraScore === phone.id} />
        </div>

        <div>
          <h4 className="text-sm font-serif font-bold text-primary mb-2 border-b border-primary/20 pb-2">Battery</h4>
          <SpecRow label="Capacity" value={phone.battery.capacity} />
          <SpecRow label="Charging" value={phone.battery.charging} />
          <SpecRow label="Endurance Score" value={`${phone.battery.score}/100`} isWinner={winners.batteryScore === phone.id} />
        </div>

        <div>
          <h4 className="text-sm font-serif font-bold text-primary mb-2 border-b border-primary/20 pb-2">Storage</h4>
          <SpecRow label="Options" value={phone.storage.join(", ")} />
        </div>

      </div>
    </div>
  );
}
