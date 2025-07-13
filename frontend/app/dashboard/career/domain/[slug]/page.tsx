import DomainContent from "./DomainContent";
import { notFound } from "next/navigation";

type Domain = {
    title: string;
    description: string;
    growth: string;
    avgSalary: string;
    demandLevel: string;
    timeToMaster: string;
    whatToMaster: {
        title: string;
        skills: string[];
        description: string;
    }[];
    jobOpportunities: {
        title: string;
        company: string;
        location: string;
        salary: string;
        link: string;
    }[];
    futureScope: string[];
};

const domains: Record<string, Domain> = {
    "artificial-intelligence-&-ml": {
        title: "Artificial Intelligence & Machine Learning",
        description:
            "Build intelligent systems that can learn, reason, and make decisions",
        growth: "+45%",
        avgSalary: "$120k",
        demandLevel: "Very High",
        timeToMaster: "2-4 Years",
        whatToMaster: [
            {
                title: "Programming Languages",
                skills: ["Python", "R", "Julia", "Scala", "SQL"],
                description:
                    "Core languages for AI/ML development and data manipulation",
            },
            {
                title: "Machine Learning Frameworks",
                skills: [
                    "TensorFlow",
                    "PyTorch",
                    "Scikit-learn",
                    "Keras",
                    "XGBoost",
                ],
                description:
                    "Essential tools for building and training ML models",
            },
            {
                title: "Mathematics & Statistics",
                skills: [
                    "Linear Algebra",
                    "Calculus",
                    "Statistics",
                    "Probability",
                    "Optimization",
                ],
                description:
                    "Mathematical foundations crucial for understanding ML algorithms",
            },
        ],
        jobOpportunities: [
            {
                title: "Machine Learning Engineer",
                company: "Google",
                location: "Remote",
                salary: "$150K - $250K",
                link: "https://careers.google.com",
            },
            {
                title: "AI Research Scientist",
                company: "OpenAI",
                location: "San Francisco",
                salary: "$180K - $300K",
                link: "https://openai.com/careers",
            },
        ],
        futureScope: [
            "Exponential growth in AI applications across industries",
            "Rising demand for AI experts in healthcare, finance, and autonomous systems",
            "Emerging opportunities in generative AI and large language models",
        ],
    },
    "web-development": {
        title: "Web Development",
        description: "Build modern web applications and digital experiences",
        growth: "+38%",
        avgSalary: "$95k",
        demandLevel: "Very High",
        timeToMaster: "1-2 Years",
        whatToMaster: [
            {
                title: "Frontend Technologies",
                skills: [
                    "React",
                    "Vue.js",
                    "Angular",
                    "TypeScript",
                    "HTML/CSS",
                ],
                description: "Modern frameworks for building user interfaces",
            },
            {
                title: "Backend Development",
                skills: ["Node.js", "Python", "Java", "Databases", "APIs"],
                description: "Server-side technologies and architecture",
            },
        ],
        jobOpportunities: [
            {
                title: "Full Stack Developer",
                company: "Microsoft",
                location: "Remote",
                salary: "$120K - $180K",
                link: "https://careers.microsoft.com",
            },
            {
                title: "Frontend Engineer",
                company: "Meta",
                location: "Remote",
                salary: "$140K - $220K",
                link: "https://careers.meta.com",
            },
        ],
        futureScope: [
            "Growing demand for web applications across all industries",
            "Emergence of new frameworks and technologies",
            "Increasing focus on performance and user experience",
        ],
    },
};

export function generateStaticParams() {
    return [
        { slug: "artificial-intelligence-&-ml" },
        { slug: "web-development" },
        { slug: "cloud-computing" },
        { slug: "cybersecurity" },
        { slug: "data-science" },
        { slug: "devops" },
        { slug: "mobile-development" },
    ];
}

export default function DomainDetailPage({
    params: { slug },
}: {
    params: { slug: string };
}) {
    const domainData = domains[slug];

    if (!domainData) {
        notFound();
    }

    return <DomainContent domain={domainData} />;
}
