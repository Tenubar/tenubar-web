/**
 * Interface representing work experience details.
 *
 * @property {string} title - The job title of the position.
 * @property {string} startDate - The start date of the position in the format YYYY-MM-DD.
 * @property {string} [endDate] - The end date of the position in the format YYYY-MM-DD.
 *                                Optional, can be omitted if the position is current.
 * @property {string} company - The name of the company where the position was held.
 * @property {string} location - The geographic location of the company (e.g., city, state, country).
 * @property {string} description - A brief description of the roles and responsibilities
 *                                   associated with the position.
 * @property {string[]} goals - A list of professional goals achieved or targeted during the position.
 * @property {boolean} currentJob - Indicates whether the position is the current job.
 */
interface WorkExperience {
    title: string;
    startDate: string;
    endDate?: string;
    company: string;
    location: string;
    description: string;
    goals: string[];
    currentJob: boolean;
}

/**
 * Represents an array of work experiences.
 *
 * Each work experience object contains details about
 * a job position including the title, start and end dates,
 * company name, job location, description of the role,
 * a list of goals or achievements, and a flag indicating
 * if it is the current job.
 *
 * @type {Array<Object>}
 * @property {string} title - The job title.
 * @property {string} startDate - The start date of the job in YYYY-MM-DD format.
 * @property {string} [endDate] - The end date of the job in YYYY-MM-DD format. Optional for current jobs.
 * @property {string} company - The name of the company.
 * @property {string} location - The location of the job.
 * @property {string} description - A brief description of the job responsibilities.
 * @property {Array<string>} goals - A list of goals or achievements within the job.
 * @property {boolean} currentJob - A flag indicating if the job is the current one.
 */
const workExperience:WorkExperience[] = [
    {
        title: "Full-Stack Developer for SolarTech",
        startDate: "2023-11-10",
        company: "SolarTech",
        location: "Venezuela",
        description: "Developed and maintained the android application 'Solar - Dolar en Venezuela' using Apache Cordova, NodeJs and Firebase.",
        goals: [
            "Developed the application 'Solar - Dolar en Venezuela', using Apache Cordova, Javascript, NodeJs, Firebase and Github.",
            "Worked with a team of 2 and created a database using a web hosting service and github.",
            "Created an API and an automatic process for the application to update automatically.",
        ],
        currentJob: true,
    },
    {
        title: "Developer for Hellven X",
        startDate: "2024-04-24",
        endDate: "2025-01-02",
        company: "Tenubar",
        location: "Venezuela",
        description: "I created a dress-up game using Phaser 3.8 with save features and customizable stories.",
        goals: [
            "Created a fully functional Dress-up Game using phaser 3.8",
            "Added a save features and customizable stories and plenty of clothes to choose",
            "Working on adding a Database, UI, Graphics, Icons and more.",
        ],
        currentJob: false,
    },
    {
        title: "Developer for Solar API",
        startDate: "2025-01-25",
        endDate: "2025-02-02",
        company: "SolarTech",
        location: "Venezuela",
        description: "Created an API for 'Solar- Dolar en Venezuela' with PostgreSQL and Github",
        goals: [
            "Developed a webpage with a login screen, if login succesfully the user can obtain access to the values/data of the API",
            "Worked Individually, created the API using, NodeJS, Crypto, PostgreSQL and Github",
            "Currently the API and values of Solar are on sale for small businesses",
        ],
        currentJob: false,
    },
];
export default workExperience;