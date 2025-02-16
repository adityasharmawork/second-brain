// import { useState } from "react"
// import { Button } from "../components/Button"
// import { Card } from "../components/Card"
// import { CreateContentModal } from "../components/CreateContentModal"
// import { PlusIcon } from "../icons/PlusIcon"
// import { ShareIcon } from "../icons/ShareIcon"
// import { Sidebar } from "../components/Sidebar"
// import { useContent } from "../hooks/useContent"

// function Dashboard() {
//   const [modalOpen, setModalOpen] = useState(false);
//   const contents = useContent();

//   return (
//     <div>
//       <Sidebar />
//       <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
//         <CreateContentModal open={modalOpen} onClose={() => {setModalOpen(false)}}/>
//         <div className="flex justify-end gap-4">
//           <Button variant="secondary" text="Share Brain" startIcon={<ShareIcon></ShareIcon>}/>
//           <Button variant="primary" text="Add Content" startIcon={<PlusIcon></PlusIcon>} onClick={() => {setModalOpen(true);}}/>
//         </div>
        
//         {/* <div className="flex gap-4"> */}
          
          
//           {/* {contents.map(({type, link, title}, index) => 
//             <Card type={type} link={link} title={title} key={index}/>
//           )} */}


//           {/* <Card type="twitter" link="https://x.com/AdityaSharma056/status/1884310723960184963" title="First tweet"/>
//           <Card type="youtube" link="https://www.youtube.com/watch?v=sSRaakd95Nk" title="DevOps Course Video"/> */}
//         {/* </div> */}

//       </div>
//     </div>
//   )
// }

// export default Dashboard






import { useEffect, useState } from "react"
import { Button } from "../components/Button"
import { Card } from "../components/Card"
import { CreateContentModal } from "../components/CreateContentModal"
import { PlusIcon } from "../icons/PlusIcon"
import { ShareIcon } from "../icons/ShareIcon"
import { Sidebar } from "../components/Sidebar"
import { useContent } from "../hooks/useContent"
import { BACKEND_URL } from "../config"
import axios from "axios"

export default function Dashboard() {
  const [modalOpen, setModalOpen] = useState(false);
  const {contents, refresh} = useContent();

  useEffect(() => {
    refresh();
  }, [modalOpen])

  return <div>
    <Sidebar />
    <div className="p-4 ml-72 min-h-screen bg-gray-100 border-2">
      <CreateContentModal open={modalOpen} onClose={() => {
        setModalOpen(false);
      }} />
      <div className="flex justify-end gap-4">
        <Button onClick={async () => {
            const response = await axios.post(`${BACKEND_URL}/api/v1/brain/share`, {
                share: true
            }, {
                headers: {
                    "Authorization": localStorage.getItem("token")
                }
            });
            const shareUrl = `http://localhost:5173/share/${response.data.hash}`;
            navigator.clipboard.writeText(shareUrl);
            alert("URL Copied!");
        }} variant="secondary" text="Share brain" startIcon={<ShareIcon />}></Button>
        <Button onClick={() => {
          setModalOpen(true)
        }} variant="primary" text="Add content" startIcon={<PlusIcon />}></Button>
      </div>

      <div className="flex gap-4 flex-wrap">
        {contents.map(({type, link, title}) => <Card 
            type={type}
            link={link}
            title={title}
        />)}
      </div>
    </div>
  </div>
}
