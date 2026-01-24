import { getDictionaryLink } from "@/utils/getDictionaryLink";

interface CardListItemProps {
    title: string;
    sub_title: string;
    years: string;
    details: string;
    skills: { id: string; name: string }[];
}

export function CardListItem({
    title, sub_title, years, details, skills
}: CardListItemProps) {

    return (
        <li className="p-5 bg-background-offset shadow-lg rounded-xl border border-default hover:bg-border transition-all duration-500">
            <div className="flex flex-col sm:flex-row justify-between items-start">
                <div className="mb-4 sm:mb-0">
                    <h3 className="text-2xl font-semibold">{title}</h3>
                    <p className="text-lg font-medium text-primary pt-2">{sub_title}</p>
                </div>
                <p className="text-sm text-offset sm:text-right whitespace-nowrap">{years}</p>
            </div>
            <ul className="flex flex-wrap gap-2 mt-4">
                {skills?.map((skill) => {
                    const dictionaryLink = getDictionaryLink(skill.id);
                    return dictionaryLink ? (
                        <li key={skill.id}>
                            <a
                                href={dictionaryLink}
                                className="px-2 bg-primary rounded-full text-white hover:bg-primary transition-colors cursor-pointer inline-block"
                            >
                                {skill.name}
                            </a>
                        </li>
                    ) : (
                        <li
                            key={skill.id}
                            className="px-2 bg-primary rounded-full text-white"
                        >
                            {skill.name}
                        </li>
                    );
                })}
            </ul>
            <p className="mt-4 text-offset leading-relaxed">{details}</p>
        </li>
    )
}