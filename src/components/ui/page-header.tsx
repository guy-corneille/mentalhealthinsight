interface PageHeaderProps {
    title: string;
    description?: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
    return (
        <div className="bg-white border-b">
            <div className="container mx-auto py-8">
                <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
                {description && (
                    <p className="text-muted-foreground mt-2">{description}</p>
                )}
            </div>
        </div>
    );
} 