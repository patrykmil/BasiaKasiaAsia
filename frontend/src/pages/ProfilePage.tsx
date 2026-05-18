import Menu from "@/components/Menu";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import type { SerializedEditorState } from "lexical"
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Editor } from "@/components/blocks/editor-00/editor";
import { useState } from "react";

const dummyNickname = "Asia";
const dummyDate = "28-11-2001";

const initialValue = {
  root: {
    children: [
      {
        children: [
          {
            detail: 0,
            format: 0,
            mode: "normal",
            style: "",
            text: "Hello World 🚀",
            type: "text",
            version: 1,
          },
        ],
        direction: "ltr",
        format: "",
        indent: 0,
        type: "paragraph",
        version: 1,
      },
    ],
    direction: "ltr",
    format: "",
    indent: 0,
    type: "root",
    version: 1,
  },
} as unknown as SerializedEditorState

  const handleUpdateSignature = () => {
    // In a real app, you’d send this to your backend (e.g., via API)
    console.log("Updated signature:", "JEBAC DISA KURWE JEBANA GIERCZAKA");
    alert("Signature updated successfully!");
  };

function ProfilePage() {
  const [editorState, setEditorState] = useState<SerializedEditorState>(initialValue)
  // Edit mode and form state for profile fields
  const [isEditing, setIsEditing] = useState(false);
  const [nickname, setNickname] = useState<string>(dummyNickname);
  const [dateOfBirth, setDateOfBirth] = useState<string>(dummyDate);
  const [gender, setGender] = useState<string>("-");
  // backup to revert on cancel
  const [backup, setBackup] = useState({ nickname: dummyNickname, dateOfBirth: dummyDate, gender: "-" });

  return (
    <div className="w-full min-h-screen flex flex-col gap-4 p-4 bg-background">
      <Menu />
      <ScrollArea className="flex-1">
        <div className="max-w-5xl mx-auto flex flex-col items-center gap-6">
          <Card className="w-full md:w-3/4 lg:w-2/3 border-0 shadow-none">
            <CardHeader className="text-center">
              <CardTitle className="text-5xl font-bold">
                {dummyNickname}'s Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col items-center gap-3">
              <img
                src="/src/assets/img/Asia.jpg"
                alt="Profile Picture"
                className="rounded-3xl w-56 h-56 md:w-80 md:h-80 object-cover"
              />
              <div className="text-sm text-muted-foreground">
                Joined: {dummyDate}
              </div>
            </CardContent>
          </Card>

          <Card className="w-full shadow-md">
            <CardHeader>
              <CardTitle className="text-5xl font-bold">About Me</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-justify text-sm md:text-base">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...
              </p>

              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="item-1">
                  <AccordionTrigger className="text-xl font-semibold">
                    Profile Information
                  </AccordionTrigger>
                    <AccordionContent className="space-y-4 text-sm md:text-base">
                    {/* Table for Profile Data */}
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Field</TableHead>
                          <TableHead>Value</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Nickname</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input value={nickname} onChange={(e) => setNickname(e.target.value)} />
                            ) : (
                              nickname
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Date of Birth</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input value={dateOfBirth} onChange={(e) => setDateOfBirth(e.target.value)} />
                            ) : (
                              dateOfBirth
                            )}
                          </TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Account Created</TableCell>
                          <TableCell>{dummyDate}</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Gender</TableCell>
                          <TableCell>
                            {isEditing ? (
                              <Input value={gender} onChange={(e) => setGender(e.target.value)} />
                            ) : (
                              gender
                            )}
                          </TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
<div className="flex justify-end">
                      {!isEditing ? (
                        <Button
                          onClick={() => {
                            setBackup({ nickname, dateOfBirth, gender });
                            setIsEditing(true);
                          }}
                        >
                          Edit
                        </Button>
                      ) : (
                        <div className="flex gap-2">
                          <Button
                            onClick={() => {
                              // Save changes (in a real app, persist to backend)
                              setIsEditing(false);
                            }}
                          >
                            Save
                          </Button>
                          <Button
                            variant="secondary"
                            onClick={() => {
                              // Revert changes
                              setNickname(backup.nickname);
                              setDateOfBirth(backup.dateOfBirth);
                              setGender(backup.gender);
                              setIsEditing(false);
                            }}
                          >
                            Cancel
                          </Button>
                        </div>
                      )}
                    </div>
                    {/* Custom Signature */}
                    <div className="mt-6">
                      <h3 className="text-lg font-semibold mb-2">
                        Custom User Signature
                      </h3>
                      <div className="border rounded-md p-2">
                        <Editor
                            editorSerializedState={editorState}
                            onSerializedChange={(value) => setEditorState(value)}
                        />
                      </div>
                      <div className="mt-3 flex justify-end">
                        <Button onClick={handleUpdateSignature}>
                          Update Signature
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </div>
  );
}

export default ProfilePage;
