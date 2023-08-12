import { Car } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";

const testimonials = [
  {
    name: "Ekjot",
    avatar: "E",
    title: "Software Engineer",
    description: "A complete hub for all your AI needs at affordable prices",
  },
  {
    name: "Aditya",
    avatar: "A",
    title: "Blockchain Developer",
    description: "This is the best application I've used for understanding dense and highly coupled codes",
  },
  {
    name: "Arjun",
    avatar: "A",
    title: "Data Scientist",
    description: "One stop solution for all your problems",
  },
  {
    name: "Parth",
    avatar: "A",
    title: "Web Developer",
    description: "Best Place for code debugging and generation",
  },
];

export const LandingContent = () => {
  return (
    <div className="px-10 pb-20">
      <h2 className="text-center text-4xl text-white font-extrabold mb-10">
        Testimonials
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {testimonials.map((item) => (
          <Card
            key={item.description}
            className="bg-[#192339] border-none text-white"
          >
            <CardHeader>
              <CardTitle className="flex items-center gap-x-2">
                <div>
                  <p className="text-lg">{item.name}</p>
                  <p className="text-zinc-400 text-sm">{item.title}</p>
                </div>
              </CardTitle>
              <CardContent className="pt-4 px-0">
                {item.description}
              </CardContent>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
};
