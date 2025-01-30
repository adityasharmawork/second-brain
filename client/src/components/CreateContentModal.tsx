import { useRef, useState } from "react";
import { CrossIcon } from "../icons/CrossIcon";
import { Button } from "./Button";
import { Input } from "./Input";
import { BACKEND_URL } from "../config";
import axios from "axios";

enum ContentType {
    Youtube = "youtube",
    Twitter = "twitter",
}

interface CreateContentModalProps {
    open: boolean; // State to determine if the modal is open
    onClose: () => void; // Function to close the modal
}

// controlled components
export function CreateContentModal({open, onClose}: CreateContentModalProps) {

    const titleRef = useRef<HTMLInputElement>();
    const linkRef = useRef<HTMLInputElement>();
    const [type, setType] = useState(ContentType.Youtube);

    async function addContent() {
        const title = titleRef.current?.value;
        const link = linkRef.current?.value;

        await axios.post(`${BACKEND_URL}/api/v1/content`, {
            title,
            link,
            type,
        }, {
            headers: {
                "Authorization": localStorage.getItem("token")
            }
        });

        onClose();
    }

    return <div>
            { open && (<div className="w-screen h-screen fixed top-0 left-0 bg-slate-500 bg-opacity-60 flex justify-center">
                <div className="flex flex-col justify-center">
                    <span className="bg-white opacity-100 p-4 rounded">
                        <div className="flex justify-end">
                            <div onClick={onClose} className="cursor-pointer">
                                <CrossIcon />
                            </div>
                        </div>
                        <div>
                            <Input reference={titleRef} placeholder="Title" />
                            <Input reference={linkRef} placeholder="Link" />
                        </div>
                        <h3 className="pt-8 ml-4">Type -</h3>
                        <div className="flex justify-center  py-4 pb-8 gap-2">
                            <Button text="Youtub" onClick={() => setType(ContentType.Youtube)} variant={type === ContentType.Youtube ? "primary" : "secondary"}/>
                            <Button text="Twitter" onClick={() => setType(ContentType.Twitter)} variant={type === ContentType.Twitter ? "primary" : "secondary"}/>
                        </div>
                        <div className="flex justify-center">
                            <Button onClick={addContent} variant="primary" text="Submit" fullWidth={true}/>
                        </div>
                    </span>
                </div>
            </div> )}
        </div>
}

