interface Education {
    title: string;
    startDate: string;
    endDate?: string;
    school: string;
    location: string;
    description: string;
    currentUni: boolean;
}

const  education: Education[] = [
    {
        title: "Bachelor in Graphic Design",
        startDate: "2019-09-17",
        endDate: "2022-11-24",
        school: "Instituto Universitario de Tecnología Antonio José de Sucre, ampliación Anaco",
        location: "Venezuela",
        description: "I developed a thesis about 3D design, graduated as a T.S.U (Associate Degree) in graphic design",
        currentUni: false,
    },
];

export default education;