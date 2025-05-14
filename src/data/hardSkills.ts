interface HardSkill {
  name: string;
  description: string;
  icon: string;
}

const hardSkills: HardSkill[] = [
  {
    name: "NodeJs",
    description: "I've been using NodeJs for backend development since 2023",
    icon: "nodejs"
  },
  {
    name: "Javascript",
    description: "My favorite programming language to work with",
    icon: "javascript"
  },
  {
    name: "Typescript",
    description: "TS is the standard programming language i use to make web pages",
    icon: "typescript"
  },
  {
    name: "React",
    description: "Framework i use to build front-end and dynamic apps",
    icon: "reactsvg"
  },
  {
    name: "Vite",
    description: "Vite helps me speed up the development of my web-apps!",
    icon: "vitejs"
  },
  {
    name: "PostgreSQL",
    description: "The database i use for more complicated mobile apps",
    icon: "mongodb"
  },
  {
    name: "MongoDB",
    description: "The database i use for modern webs, login forms, chats and others",
    icon: "blender"
  },
  {
    name: "Clickteam Fusion 2.5",
    description: "A great game maker software i use to make games, i have plenty of experience using it",
    icon: "ctf25"
  },
];

export default hardSkills;
