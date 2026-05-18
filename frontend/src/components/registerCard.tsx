import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { ChevronDownIcon } from "lucide-react";

interface RegisterCardProps {
    onRegister: (data: {
        name: string;
        email: string;
        password: string;
        repeatPassword: string;
        gender: string;
        date: Date | undefined;
    }) => void;
    title?: string;
    description?: string;
    buttonText?: string;
    hideCard?: boolean;
}

export function RegisterCard({ 
    onRegister, 
    title = "Sign Up!", 
    description = "Don't have an account? Register now!",
    buttonText = "Sign Up",
    hideCard = false
}: RegisterCardProps) {
    const [nameRegister, setNameRegister] = React.useState("");
    const [emailRegister, setEmailRegister] = React.useState("");
    const [passwordRegister, setPasswordRegister] = React.useState("");
    const [repeatPasswordRegister, setRepeatPasswordRegister] = React.useState("");
    const [genderRegister, setGenderRegister] = React.useState("");
    const [open, setOpen] = React.useState(false);
    const [date, setDate] = React.useState<Date | undefined>(undefined);

    const handleSubmit = () => {
        onRegister({
            name: nameRegister,
            email: emailRegister,
            password: passwordRegister,
            repeatPassword: repeatPasswordRegister,
            gender: genderRegister,
            date: date,
        });
        
        // Clear form after submission
        setNameRegister("");
        setEmailRegister("");
        setPasswordRegister("");
        setRepeatPasswordRegister("");
        setGenderRegister("");
        setDate(undefined);
    };

    const formContent = (
        <>
            {!hideCard && title && (
                <CardHeader>
                    <CardTitle>{title}</CardTitle>
                    {description && <CardDescription>{description}</CardDescription>}
                </CardHeader>
            )}
            <CardContent className="grid gap-6">
                <div className="grid gap-3">
                    <Label htmlFor="register-name">Name</Label>
                    <Input 
                        id="register-name" 
                        value={nameRegister} 
                        placeholder="Your name" 
                        onChange={(e) => setNameRegister(e.target.value)} 
                    />
                </div>
                <div className="grid gap-3">
                    <Select value={genderRegister} onValueChange={setGenderRegister}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectGroup>
                                <SelectLabel>Gender</SelectLabel>
                                <SelectItem value="female">female</SelectItem>
                                <SelectItem value="male">male</SelectItem>
                                <SelectItem value="non-binary">non-binary</SelectItem>
                            </SelectGroup>
                        </SelectContent>
                    </Select>
                </div>
                <div className="flex flex-col gap-3">
                    <Label htmlFor="register-date" className="px-1">
                        Date of birth
                    </Label>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                variant="outline"
                                id="register-date"
                                className="w-48 justify-between font-normal"
                            >
                                {date ? date.toLocaleDateString() : "Select date"}
                                <ChevronDownIcon />
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto overflow-hidden p-0" align="start">
                            <Calendar
                                mode="single"
                                selected={date}
                                captionLayout="dropdown"
                                onSelect={(date) => {
                                    setDate(date)
                                    setOpen(false)
                                }}
                            />
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                        id="register-email" 
                        value={emailRegister} 
                        placeholder="your.email@gmail.com" 
                        onChange={(e) => setEmailRegister(e.target.value)} 
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="register-password">Password</Label>
                    <Input 
                        id="register-password" 
                        type="password" 
                        value={passwordRegister} 
                        placeholder="Your password" 
                        onChange={(e) => setPasswordRegister(e.target.value)} 
                    />
                </div>
                <div className="grid gap-3">
                    <Label htmlFor="register-repeat-password">Repeat password</Label>
                    <Input 
                        id="register-repeat-password" 
                        type="password" 
                        value={repeatPasswordRegister} 
                        placeholder="Repeat password" 
                        onChange={(e) => setRepeatPasswordRegister(e.target.value)} 
                    />
                </div>
            </CardContent>
            <CardFooter>
                <Button className="bg-black! text-white" onClick={handleSubmit}>
                    {buttonText}
                </Button>
            </CardFooter>
        </>
    );

    if (hideCard) {
        return <div className="space-y-6">{formContent}</div>;
    }

    return <Card>{formContent}</Card>;
}
