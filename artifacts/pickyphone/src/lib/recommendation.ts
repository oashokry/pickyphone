import { Phone } from "../data/phones";

export type Priority = "camera" | "performance" | "battery" | "display" | "price" | "balanced";

export function getBestPhone(phones: Phone[], priority: Priority): { phone: Phone; reason: string } {
  if (phones.length === 0) {
    throw new Error("No phones provided");
  }

  if (phones.length === 1) {
    return { phone: phones[0], reason: "The only choice is always the best choice." };
  }

  let bestPhone = phones[0];

  switch (priority) {
    case "camera":
      bestPhone = phones.reduce((prev, current) => (prev.camera.score > current.camera.score) ? prev : current);
      return { phone: bestPhone, reason: `Best overall camera performance with a score of ${bestPhone.camera.score}.` };
    
    case "performance":
      bestPhone = phones.reduce((prev, current) => (prev.performance.score > current.performance.score) ? prev : current);
      return { phone: bestPhone, reason: `Unmatched speed and multitasking thanks to the ${bestPhone.performance.chipset}.` };
    
    case "battery":
      bestPhone = phones.reduce((prev, current) => (prev.battery.score > current.battery.score) ? prev : current);
      return { phone: bestPhone, reason: `Class-leading endurance with ${bestPhone.battery.capacity} capacity and rapid charging.` };
    
    case "display":
      bestPhone = phones.reduce((prev, current) => (prev.displayScore > current.displayScore) ? prev : current);
      return { phone: bestPhone, reason: `Stunning ${bestPhone.display.type} screen with incredible brightness and color accuracy.` };
    
    case "price":
      bestPhone = phones.reduce((prev, current) => (prev.price < current.price) ? prev : current);
      return { phone: bestPhone, reason: `The most cost-effective option at $${bestPhone.price}.` };
    
    case "balanced":
    default:
      bestPhone = phones.reduce((prev, current) => {
        const prevScore = (prev.camera.score + prev.performance.score + prev.battery.score + prev.displayScore) / 4;
        const currentScore = (current.camera.score + current.performance.score + current.battery.score + current.displayScore) / 4;
        return (prevScore > currentScore) ? prev : current;
      });
      return { phone: bestPhone, reason: "The optimal balance of performance, features, and everyday reliability." };
  }
}
