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
    name: "PostgreSQL",
    description: "The database i use for modern apps",
    icon: "mongodb"
  },
  {
    name: "Blender",
    description: "I do modeling, rendering, animations and environments in Blender",
    icon: "blender"
  },
  {
    name: "Phaser",
    description: "My favorite Javascript framework for building games for mobile and HTML5",
    icon: "react"
  },
  {
    name: "Clickteam Fusion 2.5",
    description: "A great game maker software i use to make games, i have plenty of experience using it",
    icon: "ctf25"
  },
];

export default hardSkills;