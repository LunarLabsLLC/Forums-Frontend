'use client'

import Profile from "@/libs/types/entities/Profile";
import { getUserData, updateConnectionsAction, updateEmailAction, updatePassAction } from "./ServerActions";
import { FaCogs, FaDiscord, FaInstagram, FaTwitter, FaUserShield, FaYoutube } from "react-icons/fa";
import { FaKey, FaServer, FaUnlockKeyhole } from "react-icons/fa6";
import { useState } from "react";
import { UpdateAccountPassword } from "@/services/forum/account/AccountService";
import Account from "@/libs/types/entities/Account";
import Link from "next/link";
import { MdEmail } from "react-icons/md";

interface Props {
  profile: Profile,
  account: Account,
}

export default function SettingsPage(props: Props) {
  const { profile, account } = props;

  const [connLoading, setConnLoading] = useState<boolean>(false);
  const [connError, setConnError] = useState<string>("");

  const [passError, setPassError] = useState<string>("");
  const [passSuccess, setPassSuccess] = useState<string>("");
  const [passLoading, setPassLoading] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<string>("");
  const [emailSuccess, setEmailSuccess] = useState<string>("");
  const [emailLoading, setEmailLoading] = useState<boolean>(false);

  const twitter = profile.metadata["TWITTER"];
  const twitterPrivacy = profile.metadata["TWITTER-privacy"] == "Everyone";
  const discord = profile.metadata["DISCORD"];
  const discordPrivacy = profile.metadata["DISCORD-privacy"] == "Everyone";
  const instagram = profile.metadata["INSTAGRAM"];
  const instagramPrivacy = profile.metadata["INSTAGRAM-privacy"] == "Everyone";
  const youtube = profile.metadata["YOUTUBE"];
  const youtubePrivacy = profile.metadata["YOUTUBE-privacy"] == "Everyone";

  function onSubmitConnections(formData: FormData) {
    setConnLoading(true);
    updateConnectionsAction(formData).then(res => {
      if (res) {
        setConnError(res);
        setConnLoading(false);
      } else {
        setConnError("");
        window.location.reload();
      }
    })
  }

  function onSubmitPass(formData: FormData) {
    setPassLoading(true);
    updatePassAction(formData).then(res => {
      if (res) {
        setPassError(res);
        setPassSuccess("");
        setPassLoading(false);
      } else {
        setPassError("");
        setPassSuccess("Password was changed successfully");
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  function onSubmitEmail(formData: FormData) {
    setEmailLoading(true);
    updateEmailAction(formData).then(res => {
      if (res) {
        setEmailError(res);
        setEmailSuccess("");
        setEmailLoading(false);
      } else {
        setEmailError("");
        setEmailSuccess("Email was changed successfully");
        setTimeout(() => window.location.reload(), 1000);
      }
    });
  }

  function onRequestData() {
    getUserData().then(data => {
      if (data == "Not logged in")
        window.location.replace("/auth/login");

      const obj = data as { account: Account };
      const blob = new Blob([JSON.stringify(obj, undefined, 2)], { type: "application/json" });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = 'userData.json';
      link.click();
      window.URL.revokeObjectURL(url);
    });
  }

  return <>
    <div className="flex flex-row flex-wrap gap-3 justify-around">
      <div className="flex flex-col gap-2 rounded-lg bg-base-200 border-2 border-base-300 p-3 w-fit">
        <h3 className="mx-auto">
          <FaCogs className="inline-block w-12 h-12" />
          &nbsp;Account Settings
        </h3>
        <hr />
        <h4>Connections</h4>
        <form action={onSubmitConnections} className="flex flex-col gap-2 min-w-[80vw] md:min-w-[400px] lg:min-w-[600px]">
          <div className="rounded-md bg-base-100 flex flex-row">
            <FaTwitter className="h-6 w-6 mx-2 mt-[6px]" />
            <input className="text-lg w-full rounded-e-md" name="twitter" placeholder="Twitter" defaultValue={twitter} />
          </div>
          <div className="flex flex-row ms-3">
            <input className="rounded-lg text-lg" type="checkbox" id="twitterPrivacy" name="twitterPrivacy" defaultChecked={twitterPrivacy} />
            <label htmlFor="twitterPrivacy" className="text-lg">&nbsp;Public</label>
          </div>
          <br />
          <div className="rounded-md bg-base-100 flex flex-row">
            <FaDiscord className="h-6 w-6 mx-2 mt-[6px]" />
            <input className="text-lg w-full rounded-e-md" name="discord" placeholder="Discord" defaultValue={discord} />
          </div>
          <div className="flex flex-row ms-3">
            <input className="rounded-lg text-lg" type="checkbox" id="discordPrivacy" name="discordPrivacy" defaultChecked={discordPrivacy} />
            <label htmlFor="discordPrivacy" className="text-lg">&nbsp;Public</label>
          </div>
          <br />
          <div className="rounded-md bg-base-100 flex flex-row">
            <FaInstagram className="h-6 w-6 mx-2 mt-[6px]" />
            <input className="text-lg w-full rounded-e-md" name="instagram" placeholder="Instagram" defaultValue={instagram} />
          </div>
          <div className="flex flex-row ms-3">
            <input className="rounded-lg text-lg" type="checkbox" id="instagramPrivacy" name="instagramPrivacy" defaultChecked={instagramPrivacy} />
            <label htmlFor="instagramPrivacy" className="text-lg">&nbsp;Public</label>
          </div>
          <br />
          <div className="rounded-md bg-base-100 flex flex-row">
            <FaYoutube className="h-6 w-6 mx-2 mt-[6px]" />
            <input className="text-lg w-full rounded-e-md" name="youtube" placeholder="Youtube" defaultValue={youtube} />
          </div>
          <div className="flex flex-row ms-3">
            <input className="rounded-lg text-lg" type="checkbox" id="youtubePrivacy" name="youtubePrivacy" defaultChecked={youtubePrivacy} />
            <label htmlFor="youtubePrivacy" className="text-lg">&nbsp;Public</label>
          </div>
          {connError ? <div className="py-2 text-red-600 font-bold text-lg">
            {connError}
          </div> : <></>}
          <button
            className="btn btn-primary px-5 mt-4 w-fit text-xl font-bolder bg-emerald-600 hover:bg-emerald-700 border-0 rounded-xl"
            type="submit"
            disabled={connLoading}>
            {connLoading ? "Saving.." : "SAVE"}
          </button>
        </form>
      </div>
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2 rounded-lg bg-base-200 border-2 border-base-300 p-3 w-fit">
          <h3 className="mx-auto">
            <FaUserShield className="inline-block w-12 h-12" />
            &nbsp;Security & Privacy
          </h3>
          <hr />
          <h4>Change your password</h4>
          <form action={onSubmitPass} className="flex flex-col gap-3 min-w-[80vw] md:min-w-[400px] lg:min-w-[600px]">
            <div className="rounded-md bg-base-100 flex flex-row">
              <FaUnlockKeyhole className="h-6 w-6 mx-2 mt-[6px]" />
              <input type="password" className="text-lg w-full rounded-e-md" name="currentPass" placeholder="Current password" />
            </div>
            <div className="rounded-md bg-base-100 flex flex-row">
              <FaKey className="h-6 w-6 mx-2 mt-[6px]" />
              <input type="password" className="text-lg w-full rounded-e-md" name="newPass" placeholder="New password" />
            </div>
            <div className="rounded-md bg-base-100 flex flex-row">
              <FaKey className="h-6 w-6 mx-2 mt-[6px]" />
              <input type="password" className="text-lg w-full rounded-e-md" name="newPassConfirm" placeholder="Confirm new password" />
            </div>
            <div hidden={passError == ""} className="text-red-400 text-lg">
              {passError}
            </div>
            <div hidden={passSuccess == ""} className="text-emerald-800 text-lg">
              {passSuccess}
            </div>
            <button
              className={`btn btn-primary px-5 w-fit text-xl font-bolder ${passLoading ? "bg-blue-700" : "bg-emerald-600"} hover:bg-emerald-700 border-0 rounded-xl`}
              type="submit"
              disabled={passLoading}>
              {passLoading ? "On it.." : "SAVE"}
            </button>
          </form>
          <hr className="mt-3" />
          <h4>Change your email</h4>
          <form action={onSubmitEmail} className="flex flex-col gap-3 min-w-[80vw] md:min-w-[400px] lg:min-w-[600px]">
            <div className="rounded-md bg-base-100 flex flex-row">
              <FaKey className="h-6 w-6 mx-2 mt-[6px]" />
              <input type="password" className="text-lg w-full rounded-e-md" name="password" placeholder="Your password" />
            </div>
            <div className="rounded-md bg-base-100 flex flex-row">
              <MdEmail className="h-6 w-6 mx-2 mt-[6px]" />
              <input type="text" className="text-lg w-full rounded-e-md" name="email" placeholder="New email address" defaultValue={account.email} />
            </div>
            <div hidden={emailError == ""} className="text-red-400 text-lg">
              {emailError}
            </div>
            <div hidden={emailSuccess == ""} className="text-emerald-800 text-lg">
              {emailSuccess}
            </div>
            <button
              className={`btn btn-primary px-5 w-fit text-xl font-bolder ${emailLoading ? "bg-blue-700" : "bg-emerald-600"} hover:bg-emerald-700 border-0 rounded-xl`}
              type="submit"
              disabled={emailLoading}>
              {emailLoading ? "On it.." : "SAVE"}
            </button>
          </form>
        </div>
        <div className="flex flex-col gap-2 rounded-lg bg-base-200 border-2 border-base-300 py-3 px-5 w-full">
          <h3 className="mx-auto">
            <FaServer className="inline-block w-12 h-12" />
            &nbsp;Data Management
          </h3>
          <div className="flex flex-row flex-wrap gap-2 justify-around">
            <button onClick={onRequestData} className="btn border-0 bg-blue-600 hover:bg-blue-700 px-2 text-white w-full">
              Request your data
            </button>
            <button disabled className="btn border-0 bg-red-800 hover:bg-red-900 px-2 text-white w-full">
              Delete your account
            </button>
          </div>
        </div>
      </div>
    </div>
  </>;
}
