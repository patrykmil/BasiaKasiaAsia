import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

interface CardProps {
  imageSrc: string;
  title: string;
  description: string;
}

function Cards({ imageSrc, title, description, footerText }: CardProps) {
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