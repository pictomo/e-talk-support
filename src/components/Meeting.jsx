import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { db } from "../../firebase";
import { doc, Firestore, getDoc, updateDoc } from "firebase/firestore";
import { list } from "@firebase/storage";
import { Profile } from "./Profile";
import { Form } from "./Form";
import { setMeetingCookie } from "../modules/cookie";

export const Meeting = (props) => {
  // const meetingId = props.meetingId; //propsの受け取り
  const { meetingId } = useParams();

  const [meeting, setMeeting] = useState({}); // 取得したmeetingデータの入れ物

  const [cookies, setCookie, removeCookie] = useCookies(["meetings"]);

  // ユーザーリストからユーザーを追加・削除する関数、子コンポーネントにて利用
  const addUserToList = (user) => {
    const meetingDocRef = doc(db, "meetings", meetingId);
    getDoc(meetingDocRef).then((doc) => {
      setMeeting(doc.data());
    });
  };

  const rmUserFromList = (user) => {
    const meetingDocRef = doc(db, "meetings", meetingId);
    getDoc(meetingDocRef).then((doc) => {
      setMeeting(doc.data());
    });
  };

  useEffect(() => {
    // meetingデータの取得
    const meetingDocRef = doc(db, "meetings", meetingId);
    getDoc(meetingDocRef).then((doc) => {
      setMeeting(doc.data());

      setMeetingCookie(cookies, setCookie, meetingId, doc.data().name);
    });
  }, []);

  return (
    <div>
      <div>{meeting.name}</div>
      <div>{meeting.url}</div>
      <div>
        <ul className="CardList">
          {Array.isArray(meeting.users) &&
            meeting.users.map((data, index) => {
              // 各値はuidでなくuserへのリファレンスであることに注意
              return (
                <li key={index}>
                  <div>
                    {/* 一意なkeyを渡さないとWarningでる。なぜかは知らん */}
                    <Profile
                      userRef={data}
                      meetingId={meetingId}
                      rmUserFromList={rmUserFromList}
                    />
                  </div>
                </li>
              );
            })}
        </ul>
        ;
      </div>
      <hr></hr>
      <Form meetingId={meetingId} addUserToList={addUserToList} />
    </div>
  );
};
