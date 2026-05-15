import {
    NavigationMenu,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Link } from "react-router";
import Logo from "../assets/img/Logo-full.svg"
import { useAuth } from "@/hooks/useAuth";


function Menu() {
    const auth = useAuth()

    return (
    <div className="inline-flex items-center justify-between w-full border-b border-black border-solid">
        <div>
            <img src={Logo} alt="Logo" className="h-20 m-2" />
        </div>
        <NavigationMenu>
            <NavigationMenuList>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="text-xl">
                        <Link to="/" >Main Page</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="text-xl">
                        <Link to="/forum">Forum</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {auth.isAuthenticated && auth.role === "user" && (
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="text-xl">
                        <Link to="/profile">Profile</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                )}
                {auth.isAuthenticated && auth.role === "admin" && (
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="text-xl">
                        <Link to="/admin">Admin Panel</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                )}
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="text-xl">
                        <Link to="/about">About Us</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                {auth.isAuthenticated && (
                    <NavigationMenuItem>
                        <NavigationMenuLink asChild className="text-xl">
                            <span onClick={() => auth.logout()}>Logout</span>
                        </NavigationMenuLink>
                    </NavigationMenuItem>
                )}
                {!auth.isAuthenticated && (
                <NavigationMenuItem>
                    <NavigationMenuLink asChild className="text-xl">
                        <Link to="/login">Login</Link>
                    </NavigationMenuLink>
                </NavigationMenuItem>
                )}
            </NavigationMenuList>   
        </NavigationMenu>
    </div>
    )
}

export default Menu;