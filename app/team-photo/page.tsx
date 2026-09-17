import Image from "next/image";

export default function TeamPhotoPage() {
  return (
    <section className="section team-photo-section" id="team-photo">
      <div className="heading">
        <div>
          <div className="kicker">TEAM REMO</div>
          <h2>우리가 리모입니다<span className="star">.</span></h2>
        </div>
        <p>함께 모인 순간.</p>
      </div>
      <div className="team-photo">
        <Image src="/assets/team-photo.png" alt="REMO 팀 단체 사진" width={1170} height={870} />
      </div>
    </section>
  );
}
