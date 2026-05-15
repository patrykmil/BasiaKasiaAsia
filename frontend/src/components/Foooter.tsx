import Logo from "../assets/img/Logo-full.svg"
import { Facebook,
        Instagram,
        Youtube,
        Twitter,
        Twitch,
        Linkedin,
        Banana
 } from 'lucide-react';
import { Link } from "react-router";






function Footer() {
    return (
        <div className="border-black border-solid border-t flex items-center justify-between px-2 pt-2 pb-0 m-0">
            <img src={Logo} alt="Logo" className="h-20" />
            <div className="flex gap-4">
                <Link to="https://www.facebook.com/samorzad.pk" target="_blank"><Facebook className="h-6 w-6 text-blue-600" /></Link>
                <Link to="https://www.instagram.com/samorzad_pk/" target="_blank"><Instagram className="h-6 w-6 text-pink-600" /></Link>
                <Link to="https://www.youtube.com/@HejkatuLenka" target="_blank" rel="noopener noreferrer"><Youtube className="h-6 w-6 text-red-600" /></Link>
                <Link to="/"><Twitter className="h-6 w-6 text-blue-400" /></Link>
                <Link to="/"><Twitch className="h-6 w-6 text-purple-600" /></Link>
                <Link to="https://www.linkedin.com/company/sspk---samorz%C4%85d-studencki-politechniki-krakowskiej/posts/?feedView=all" target="_blank"><Linkedin className="h-6 w-6 text-blue-700" /></Link>
                <Link to="https://www.youtube.com/watch?v=dQw4w9WgXcQ&list=RDdQw4w9WgXcQ&start_radio=1" target="_blank"><Banana className="h-6 w-6 text-yellow-500" /></Link>
            </div>
        </div>
    )
}

export default Footer;
