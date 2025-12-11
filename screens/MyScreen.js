import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import Svg, { Circle, Path } from "react-native-svg";

function LoginLogo({ size = 84 }) {
  const stroke = "#fff";
  const bg = "#66b8cf";
  return (
    <Svg width={size-20} height={size} viewBox="0 0 132 120">
      <Circle cx="66" cy="66" r="66" fill={bg} />
      <Path
        d="M35 94V47.5c0-5 6.5-15 11-15 3 0 3 7.5 4.5 9.5 1.5 2 4.5 0 6.5 0 3 0 6 5 7.5 5s4.5-6 7.5-6 6 12.5 6 17.5S68 90 66 94"
        fill="none"
        stroke={stroke}
        strokeWidth={6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
        <Path
          d="M35 94V47.5c0-5 6.5-15 11-15 3 0 3 7.5 4.5 9.5 1.5 2 4.5 0 6.5 0 3 0 6 5 7.5 5s4.5-6 7.5-6 6 12.5 6 17.5S68 90 66 94"
          fill="none"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Path
          d="M66 94c-2-4-9.5-13.5-15.5-13.5-6 0-6 7-3.5 10.5 2.5 3.5 10.5 10 13.5 10 3 0 5-4.5 5-7Z"
          fill="none"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <Circle cx="50" cy="55" r="4" fill={stroke} />
        <Circle cx="66" cy="60" r="4" fill={stroke} />
        <Path
          d="M97 60c0-4-2-8-5-10-4-3-10 0-13 5-3 5-10.5 17.5-10.5 17.5"
          fill="none"
          stroke={stroke}
          strokeWidth={6}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
    </Svg>
  );
}

export default function MyScreen({ onLogin }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <LoginLogo size={168} />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#888"
            keyboardType="email-address"
          />
          <TextInput
            style={styles.input}
            placeholder="Password"
            placeholderTextColor="#888"
            secureTextEntry
          />
          <TouchableOpacity style={styles.forgotPasswordButton}>
            <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.loginButton}
          activeOpacity={0.85}
          onPress={onLogin}
        >
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>

        <View style={styles.registerPrompt}>
          <Text style={styles.registerText}>Don't have an account?</Text>
          <TouchableOpacity>
            <Text style={styles.registerLink}>Register</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.socialLoginContainer}>
          <Text style={styles.socialLoginText}>Or login with</Text>
          <View style={styles.socialButtons}>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-google" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-facebook" size={24} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#2b3133",
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: 30,
    paddingTop: 40,
  },
  header: {
    alignItems: "center",
    marginBottom: 40,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#fff",
  },
  inputContainer: {
    marginBottom: 30,
  },
  input: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 16,
    color: "#fff",
    marginBottom: 15,
  },
  forgotPasswordButton: {
    alignSelf: "flex-end",
  },
  forgotPasswordText: {
    fontSize: 14,
    color: "#87CEEB",
  },
  loginButton: {
    backgroundColor: "#87CEEB",
    borderRadius: 10,
    paddingVertical: 15,
    alignItems: "center",
    marginBottom: 30,
  },
  loginButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#fff",
  },
  registerPrompt: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 50,
  },
  registerText: {
    fontSize: 14,
    color: "#fff",
    marginRight: 5,
  },
  registerLink: {
    fontSize: 14,
    color: "#87CEEB",
    fontWeight: "bold",
  },
  socialLoginContainer: {
    alignItems: "center",
  },
  socialLoginText: {
    fontSize: 14,
    color: "#fff",
    marginBottom: 20,
  },
  socialButtons: {
    flexDirection: "row",
    columnGap: 20,
  },
  socialButton: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});