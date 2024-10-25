"use client";
import { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableBody,
  TableColumn,
  TableCell,
  TableRow,
} from "@nextui-org/table";
import { Card } from "@nextui-org/card";
import { CircularProgress } from "@nextui-org/progress";
import { collection, getDocs } from "firebase/firestore";
import { db, collectionName } from "@/config/firebase";

const fetchUserScores = async () => {
  const scores: { uid: string; score: number; email: string }[] = [];
  const querySnapshot = await getDocs(collection(db, collectionName.users));
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    scores.push({    
      uid: doc.id.slice(0, 8),
      email: data?.email,
      score: data.score || 0,
    });
  });
  scores.sort((a, b) => b.score - a.score);
  return scores;
};

interface UserScore {
  uid: string;
  email: string
  score: number;
}

const LeaderBoardPage: React.FC = () => {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadScores = async () => {
      setLoading(true);
      const userScores = await fetchUserScores();
      setScores(userScores);
      setLoading(false);
    };

    loadScores();
  }, []);

  return (
    <section className="max-w-lg mx-auto text-center p-5">
      <h2 className="text-3xl font-bold text-primary-600 mb-6">Leaderboard</h2>
      <Card>
        {loading ? (
          <CircularProgress color="primary" />
        ) : (
          <Table
            aria-label="LeaderBoard Table"
          >
            <TableHeader>
              <TableColumn>User ID</TableColumn>
              <TableColumn>Email</TableColumn>
              <TableColumn>Score</TableColumn>
            </TableHeader>
            <TableBody>
              {scores.map((user) => (
                <TableRow key={user.uid}>
                  <TableCell>{user.uid}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.score}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </Card>
    </section>
  );
};

export default LeaderBoardPage;
