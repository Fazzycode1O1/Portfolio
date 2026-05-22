import type { Metadata } from "next";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch — for roles, projects, or just to say hi.",
};

export default function ContactPage() {
  return (
    <div className="pt-24">
      <Contact />
    </div>
  );
}
