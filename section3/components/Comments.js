"use client";

export default function Comments() {
  // if (typeof window === "undefined") {
  //   return <div>500 Comments Client.</div>;
  // }
  // return <div>500 Comments {Math.random()}</div>;
  return <div>500 Comments {Date.now()}</div>;
  //ye sab hydration error dete hain kyuki server aur client dono par alag alag values render hoga
}