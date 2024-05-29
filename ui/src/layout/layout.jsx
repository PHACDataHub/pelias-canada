import { GcdsHeader, GcdsDateModified , GcdsFooter ,GcdsContainer, GcdsHeading} from "@cdssnc/gcds-components-react";
import "@cdssnc/gcds-components-react/gcds.css"; // Import the CSS file if necessary

export default function Layout({ children}) {

  return (
<>
<GcdsHeader></GcdsHeader>
<GcdsContainer size="xl"  centered >  
<GcdsHeading tag="h1" marginTop="50" marginBottom="0"> Geocoder </GcdsHeading>
</GcdsContainer>
<GcdsContainer size="xl"  centered padding="400">  
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

      