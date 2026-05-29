import { useAuth } from "@clerk/expo";
import React from "react";
import { Pressable, ScrollView, Text } from "react-native";

const ProfileTab = () => {
  const { signOut } = useAuth(); // Placeholder for future auth logic
  return (
    <ScrollView
      className="bg-surface"
      contentInsetAdjustmentBehavior="automatic"
    >
      <Pressable
        onPress={() => signOut()}
        className="mt-4 px-4 py-2 bg-red-600 rounded"
      >
        <Text className="text-white">Sign Out</Text>
      </Pressable>
    </ScrollView>
  );
};

export default ProfileTab;
