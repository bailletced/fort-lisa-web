"use-client";

import { gql } from "@apollo/client";
import React from "react";
import { UserType } from "@/graphql/types";
import { getClient } from "../lib/apollo/client";
import { FlButton } from "../elements/Button/FlButton";

export const dynamic = "force-dynamic";

const query = gql`
  query getMe {
    me {
      email
      name
      userId
      permissionSet {
        name
        roles
      }
    }
  }
`;

export default async function ServerSide() {
  try {
    const data = await getClient().query<UserType>({
      query,
    });
    console.log(data);
  } catch (e) {
    console.log(e);
  }

  return (
    <main style={{ maxWidth: 1200, marginInline: "auto", padding: 20 }}>
      <FlButton> Ok Man</FlButton>
    </main>
  );
}
