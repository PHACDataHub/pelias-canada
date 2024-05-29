import { GcdsHeader, GcdsDateModified , GcdsFooter ,GcdsContainer} from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css"; // Import the CSS file if necessary

export default function Layout({ children}) {

  return (
<>
<GcdsHeader></GcdsHeader>

<GcdsContainer size="xl" border centered padding="400">
  <p>This is a responsive container, you can replace this text with any content or other components.</p>
  {children}
</GcdsContainer>
<GcdsDateModified>
  2023-01-26
</GcdsDateModified>


<GcdsFooter
  contextualHeading="Contextual navigation"
//   contextualLinks='{ "": "#", "Features": "#", "Activity on GC Notify": "#" }'
>
</GcdsFooter>
</>
  ) 
}

      