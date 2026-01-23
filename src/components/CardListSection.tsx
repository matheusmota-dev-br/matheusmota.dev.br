import { useState } from 'react';
import { CardListItem } from './CardListItem';

interface Item {
    title: string;
    sub_title: string;
    years: string;
    details?: string;
    skills?: {
        id: string;
        name: string;
    }[];
}

interface CardListSectionProps {
    title: string;
    items: Item[];
}

export function CardListSection({
    title, items
}: CardListSectionProps) {
    const [showAll, setShowAll] = useState(false);
    const numberOfItemsToShow = 3;

    return (
        <section className="py-14 bg-background">
            <div className="container mx-auto px-4">
                <h2 className="text-3xl lg:text-4xl font-semibold text-center mb-12">
                    {title}
                </h2>
                <div className="flex gap-8 flex-col">
                    <ul className="space-y-8">
                        {items.slice(0, showAll ? items.length : numberOfItemsToShow).map((item: Item, index) => (
                            <CardListItem
                                key={`${item.title}-${item.sub_title}-${item.years}-${index}`}
                                title={item.title}
                                sub_title={item.sub_title}
                                years={item.years}
                                details={item?.details}
                                skills={item.skills}
                            />
                        ))}
                    </ul>
                    {items.length > numberOfItemsToShow && (
                        <button
                            className="ml-auto text-blue-600 hover:underline"
                            aria-label={showAll ? 'Show less items' : 'Show more items'}
                            onClick={() => setShowAll(!showAll)}
                        >
                            {showAll ? 'Show less' : 'Show more'}
                        </button>
                    )}
                </div>
            </div>
        </section>
    )
}
