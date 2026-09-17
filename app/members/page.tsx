import { getSiteData } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function MembersPage() {
  const { members } = await getSiteData();
  return (
    <section className="section" id="members">
      <div className="heading">
        <div>
          <div className="kicker">02 — OUR PEOPLE</div>
          <h2>리모라는 우리<span className="star">.</span></h2>
        </div>
        <p>함께하는 {members.length}명을 소개합니다.</p>
      </div>
      <div className="members">
        {members.map((member, i) => (
          <div className="member" key={member.id}>
            <small>{String(i + 1).padStart(2, "0")}</small>
            <b>{member.name}</b>
          </div>
        ))}
      </div>
    </section>
  );
}
