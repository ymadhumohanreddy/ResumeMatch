import { Code, Github, Heart, Users } from 'lucide-react';

const stats = [
  {
    icon: <Github className="h-8 w-8 text-muted-foreground" />,
    value: '1.2k+',
    label: 'GitHub Stars',
  },
  {
    icon: <Users className="h-8 w-8 text-muted-foreground" />,
    value: '5k+',
    label: 'Community Users',
  },
  {
    icon: <Heart className="h-8 w-8 text-muted-foreground" />,
    value: '150+',
    label: 'Contributors',
  },
  {
    icon: <Code className="h-8 w-8 text-muted-foreground" />,
    value: 'Open',
    label: 'Source',
  },
];

export function StatsSection() {
  return (
    <section className="bg-muted/50 py-16 sm:py-20">
      <div className="container">
        <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center">
              {stat.icon}
              <p className="mt-2 text-3xl font-bold">{stat.value}</p>
              <p className="text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
