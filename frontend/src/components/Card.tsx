import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
}

function Cards({ imageSrc, title, description }: CardProps) {
    return (
        <Card className="w-80">
            <CardHeader>
                <img src={imageSrc} alt={title} className="w-full h-full object-cover rounded-md" />
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <CardDescription>{description}</CardDescription>
            </CardContent>

        </Card>
    )
}

export default Cards;