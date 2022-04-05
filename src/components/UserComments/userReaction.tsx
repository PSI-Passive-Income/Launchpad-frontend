import React from 'react'
// import { Provider, UpdownButton } from '@lyket/react';

interface Props {
  campaignId: string
}

const UserReaction: React.FC<Props> = ({ campaignId }) => {
  return (
    <div className="text-center">
      {/* <Provider
                apiKey="pt_73c45c8c6a5ba0111c8095f51618f8"
                theme={{
                    colors: {
                        background: "transparent",
                        icon: "rgba(178,178,178,1)",
                        text: "white",
                        primary: "#d2ffce",
                        secondary: "rgb(251 147 147 / 54%)",
                        highlight: "#46741e"
                    }
                }}
            >
                <UpdownButton
                    id={campaignId}
                    namespace="post"
                />
            </Provider> */}
    </div>
  )
}
export default UserReaction
