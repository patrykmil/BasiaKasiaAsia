import Menu from "@/components/Menu";
import * as React from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { useAuth } from "../hooks/useAuth";
import { register } from "../services/auth";
import { toast } from "sonner";
import { RegisterCard } from "@/components/registerCard";


function LoginPage() {
    const [activeTab, setActiveTab] = React.useState("signIn")
    const [emailLogin, setEmailLogin] = React.useState("");
    const [passwordLogin, setPasswordLogin] = React.useState("");
    const auth = useAuth();
    
    const handleLogin = async () => {
        const id = toast.loading("Logging in...");
        try{
            if (emailLogin === "" && passwordLogin === "") {
                toast.warning("Email and password are required", {id});
                return;
            }

            await auth.login(emailLogin, passwordLogin);
            toast.success("Login successful!", {id, duration: 2000});
        } catch (error) {
            toast.error(`Login error: ${error}`, {id});
        }
    }

    const handleRegister = async (data: { name: string; email: string; password: string; repeatPassword: string; gender: string; date: Date | undefined }) => {
        const id = toast.loading("Registering...");
        try {
            if (!data.email || !data.password) {
                toast.warning("Email and password are required", { id });
                return;
            }

            if (data.password !== data.repeatPassword) {
                toast.warning("Passwords do not match", { id });
                return;
            }

            await register(data.email, data.password, data.name, data.date, data.gender);
            
            // Success - switch to sign in tab
            toast.success("Registration successful! Please sign in.", { id, duration: 1000 });
            setActiveTab("signIn");
            
            setEmailLogin(data.email);
            
        } catch (error) {
            toast.error(`Registration error: ${error}`, { id });
        }
    }

    return (
        <div className='w-full min-h-screen flex flex-col gap-4 p-4 bg-gray-50'>
            <Menu />
            <div className="bg-[url(/src/assets/img/background.svg)] p-4 flex-1">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-3/10 justify-center bg-white/80 mx-auto p-4 rounded-lg">
                    <TabsList className="grid w-full grid-cols-2">
                        <TabsTrigger value="signIn">Sign In</TabsTrigger>
                        <TabsTrigger value="signUp">Sign Up</TabsTrigger>
                    </TabsList>
                    <TabsContent value="signIn">
                        <Card>
                            <CardHeader>
                                <CardTitle>Sign In!</CardTitle>
                                <CardDescription>Please sign in to your account.</CardDescription>
                            </CardHeader>
                            <CardContent className="grid gap-6">
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-email">Email</Label>
                                    <Input id="tabs-demo-email" value={emailLogin} placeholder="your.email@gmail.com" onChange={(e) => setEmailLogin(e.target.value)} />
                                </div>
                                <div className="grid gap-3">
                                    <Label htmlFor="tabs-demo-password">Password</Label>
                                    <Input id="tabs-demo-password" type="password" value={passwordLogin} placeholder="Your password" onChange={(e) => setPasswordLogin(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()}/>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button className="bg-black! text-white" onClick={handleLogin}>Sign In</Button>
                            </CardFooter>
                        </Card>
                    </TabsContent>
                    <TabsContent value="signUp">
                        <RegisterCard 
                            onRegister={handleRegister}
                            title="Sign Up!"
                            description="Don't have an account? Register now!"
                            buttonText="Sign Up"
                        />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default LoginPage;