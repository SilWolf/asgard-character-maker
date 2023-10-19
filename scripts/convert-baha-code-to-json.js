import { nanoid } from "nanoid";
import fs from "fs";

const SOURCE_BAHA_CODE = `[table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=43% valign=bottom][table width=100% cellspacing=0 cellpadding=0 border=0 align=right][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=right][tr][td][div][img=https://placehold.co/325x695.png width=325 height=695][/div][/td][/tr][/table][/td][/tr][/table][/td][td width=57% valign=bottom][table width=100% cellspacing=0 cellpadding=0 border=0 align=right][tr][td][div align=center][size=1]$topTitle$[/size][/div][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=right][tr][td][div][img=https://placehold.co/64x64.png width=64 height=64][/div][/td][td][div][img=https://placehold.co/64x64.png width=64 height=64][/div][/td][td][/td][td][div align=right][size=6]$characterName$[/size][/div][/td][/tr][/table][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=right][tr][td valign=top][div][img=https://placehold.co/70x96.png width=70 height=96][/div][/td][td valign=top][div align=right][size=3]央城大狼．銀星【沃野卿】\n  萬國商會狼族協調官兼駐央城支部長\n  阿斯嘉特傳奇冒險者、『曙葉小隊』副隊長\n  前央城正規軍千夫長、四災義勇軍榮譽軍人[/size][/div][/td][/tr][/table][/td][/tr][tr][td align=left][table width=100% cellspacing=0 cellpadding=0 border=0 align=left][tr][td][div][img=https://placehold.co/500x20.png width=500 height=20][/div][/td][/tr][/table][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=left][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=left][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]種族[/size][/div][/td][td valign=center][div align=right][size=3]狼人[/size][/div][/td][td][/td][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]性別[/size][/div][/td][td valign=center][div align=right][size=3]雄性[/size][/div][/td][/tr][tr][td colspan=4][/td][/tr][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]生日[/size][/div][/td][td valign=center][div align=right][size=3]8月5日[/size][/div][/td][td][/td][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]年齡[/size][/div][/td][td valign=center][div align=right][size=3]外表45 / 實際30[/size][/div][/td][/tr][tr][td colspan=4][/td][/tr][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]體型[/size][/div][/td][td valign=center][div align=right][size=3]215公分 / 140公斤[/size][/div][/td][td][/td][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]觀感[/size][/div][/td][td valign=center][div align=right][size=3]魁梧、成熟、霸氣[/size][/div][/td][/tr][tr][td colspan=4][/td][/tr][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]陣營[/size][/div][/td][td valign=center][div align=right][size=3]守序中立[/size][/div][/td][td][/td][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]個性[/size][/div][/td][td valign=center][div align=right][size=3]負責、耐苦、隨興[/size][/div][/td][/tr][tr][td colspan=5][/td][/tr][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]興趣[/size][/div][/td][td valign=center colspan=4][div align=right][size=3]喝酒、木工藝、解體工作、攀登、照顧孩子[/size][/div][/td][/tr][tr][td colspan=5][/td][/tr][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]喜愛[/size][/div][/td][td valign=center colspan=4][div align=right][size=3]肉、酒、溫泉、家庭話題、冒險話題、鍛練菜鳥[/size][/div][/td][/tr][tr][td colspan=5][/td][/tr][tr][td valign=center align=center bgcolor=#DDDDDD width=40][div][size=3]厭惡[/size][/div][/td][td valign=center colspan=4][div align=right][size=3]菜、甜、逃避責任者、破壞他人平靜生活的行為[/size][/div][/td][/tr][/table][/td][/tr][/table][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=left][tr][td valign=bottom width=33%][div][size=3][img=https://placehold.co/1920x1080.png][/size][/div][/td][td valign=bottom width=33%][div][size=3][img=https://placehold.co/1920x1080.png][/size][/div][/td][td valign=bottom width=33%][div][size=3][img=https://placehold.co/1920x1080.png][/size][/div][/td][/tr][/table][/td][/tr][/table][/td][/tr][/table][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=100% valign=top][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=33% valign=top][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=40% bgcolor=#DDDDDD align=center][div][size=3]戰鬥職業[/size][/div][/td][td][/td][td width=60% bgcolor=#DDDDDD align=center][div][size=3]風格[/size][/div][/td][/tr][tr][td align=center][div][size=3]戰士、前衛[/size][/div][/td][td][/td][td align=center][div][size=3]戰術、硬碰硬[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=100% bgcolor=#DDDDDD align=center][div][size=3]慣用武器、魔法、其他[/size][/div][/td][/tr][tr][td align=center][div][size=3]大劍、斧、爪牙、霰彈槍\n  大地系、闇系、冰系魔法\n  獅鷲、狼群戰術、狼系權能[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=20% bgcolor=#DDDDDD align=center][div][size=3]力[/size][/div][/td][td][/td][td width=20% bgcolor=#DDDDDD align=center][div][size=3]敏[/size][/div][/td][td][/td][td width=20% bgcolor=#DDDDDD align=center][div][size=3]體[/size][/div][/td][td][/td][td width=20% bgcolor=#DDDDDD align=center][div][size=3]魔[/size][/div][/td][td][/td][td width=20% bgcolor=#DDDDDD align=center][div][size=3]精[/size][/div][/td][/tr][tr][td align=center][div][size=3]A[/size][/div][/td][td][/td][td align=center][div][size=3]C[/size][/div][/td][td][/td][td align=center][div][size=3]S[/size][/div][/td][td][/td][td align=center][div][size=3]C[/size][/div][/td][td][/td][td align=center][div][size=3]D[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=13% bgcolor=#DDDDDD align=center][div][size=3]火[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]水[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]風[/size][/div][/td][td][/td][td width=13% bgcolor=#DDDDDD align=center][div][size=3]土[/size][/div][/td][td][/td][td width=13% bgcolor=#DDDDDD align=center][div][size=3]冰[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]雷[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]聖[/size][/div][/td][td][/td][td width=13% bgcolor=#DDDDDD align=center][div][size=3]闇[/size][/div][/td][/tr][tr][td align=center][div][size=3][/size][/div][/td][td][/td][td align=center][div][size=3][/size][/div][/td][td][/td][td align=center][div][size=3][/size][/div][/td][td][/td][td align=center][div][size=3]⦾[/size][/div][/td][td][/td][td align=center][div][size=3]○[/size][/div][/td][td][/td][td align=center][div][size=3]△[/size][/div][/td][td][/td][td align=center][div][size=3][/size][/div][/td][td][/td][td align=center][div][size=3]⦾[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=13% bgcolor=#DDDDDD align=center][div][size=3]陸[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]海[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]空[/size][/div][/td][td][/td][td width=13% bgcolor=#DDDDDD align=center][div][size=3]森[/size][/div][/td][td][/td][td width=13% bgcolor=#DDDDDD align=center][div][size=3]脈[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]沼[/size][/div][/td][td][/td][td width=12% bgcolor=#DDDDDD align=center][div][size=3]寒[/size][/div][/td][td][/td][td width=13% bgcolor=#DDDDDD align=center][div][size=3]熱[/size][/div][/td][/tr][tr][td align=center][div][size=3]⦾[/size][/div][/td][td][/td][td align=center][div][size=3]×[/size][/div][/td][td][/td][td align=center][div][size=3]△[/size][/div][/td][td][/td][td align=center][div][size=3]⦾[/size][/div][/td][td][/td][td align=center][div][size=3]○[/size][/div][/td][td][/td][td align=center][div][size=3]×[/size][/div][/td][td][/td][td align=center][div][size=3]○[/size][/div][/td][td][/td][td align=center][div][size=3]×[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=30% bgcolor=#DDDDDD align=center][div][size=3]國籍[/size][/div][/td][td][/td][td width=70% bgcolor=#DDDDDD align=center][div][size=3]隸屬[/size][/div][/td][/tr][tr][td align=center][div][size=3]喀爾登[/size][/div][/td][td][/td][td align=center][div][size=3]萬國商會、自由聯邦[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=50% bgcolor=#DDDDDD align=center][div][size=3]特徵傾向[/size][/div][/td][td][/td][td width=50% bgcolor=#DDDDDD align=center][div][size=3]能力傾向[/size][/div][/td][/tr][tr][td align=center][div][size=3]西北的獸型[/size][/div][/td][td][/td][td align=center][div][size=3]北方的蠻力[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=100% bgcolor=#DDDDDD align=center][div][size=3]人生目標[/size][/div][/td][/tr][tr][td align=center][div][size=3]守護家庭、守護阿斯嘉特\n  維持狼族在世界上的地位\n  等待『那女孩』、尋找通往\n  『那女孩』所在的門[/size][/div][/td][/tr][/table][/td][/tr][tr][td][/td][/tr][/table][/td][td width=67% valign=top][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=100% bgcolor=#DDDDDD align=left][div][size=3]身分與形象[/size][/div][/td][/tr][tr][td align=left][div][size=3]　　滿讀品他建件神確容國方題能結！那內書再資告片；起斯有識不道中處程遠世我把業，因型北滿作難，沒他而時情司兩阿，電為人高，操解健認子日民機血重景房主管完覺笑臉為陽前人……像國爭，團去加他：人紅文的那畫？\n  　　看成總地你技進種他有著性頭水友任個政智了由立害北心、實優超一，查文一，以著答師！一流發還氣五當團。童放是容安用腦的，子加善生為然下元報海單不冷火去易？頭法意止房方收進不造處南期當人，不老一得者時人了木使詩變的於條對給文的覺是口，回腳不多此爾。[/size][/div][/td][/tr][/table][/td][/tr][tr][td height=24][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=100% bgcolor=#DDDDDD align=left][div][size=3]事蹟[/size][/div][/td][/tr][tr][td align=left][div][size=3]　　全記邊增……始以該賣……歡感但種育世本！的男活異臺不報拿出邊我舞當發外公生取物的學，境一標試來初格金，來文國不報了……\n  　　些式大、車如生民須代出市孩積力細行速放幾，故點香木氣際謝：們山白消能產受不對民文，期會的未代香長，海子美能收生後來雙取壓集國們光打香使部夫遠來性來手物要受上的來試見提次家適市新員價節成管最軍手，在雖基全能推的可用，病識滿時形待相賽門眼區果實食幾業門給結說不獨下定背動年總其存種一關德！[/size][/div][/td][/tr][/table][/td][/tr][tr][td height=24][/td][/tr][tr][td][table width=100% cellspacing=0 cellpadding=0 border=0 align=center][tr][td width=100% bgcolor=#DDDDDD align=left][div][size=3]人脈關係[/size][/div][/td][/tr][tr][td align=left][div][size=3]　　規相登間又分以見流被印圖的，早邊演個分效意臺過計的年。也明聲還、起體人道電子原員維門舞人足果寶利那？樂清希保月……裡沒這子一健有只及口部真車！兩路中又合雖機跟雖病則才人得國如細走同了時年好綠地總道保市港空的研大動頭溫新觀主點很產馬玩市的利美們。[/size][/div][/td][/tr][/table][/td][/tr][tr][td height=24][/td][/tr][/table][/td][/tr][/table][/td][/tr][/table]`;

let replacedBahaCode = SOURCE_BAHA_CODE;

// Part 1: Text Props
const textProps = [];
const parsedTextProps = [
  ...replacedBahaCode.matchAll(/\[size=[123456]\]([^\]]*)\[\/size\]/g),
]
  .map((result, i) => ({
    text: result[1],
    startIndex: result.index + 8,
    length: result[1].length,
    order: i,
  }))
  .reverse();

for (const parsedTextProp of parsedTextProps) {
  const id = `text_${nanoid(8)}`;
  textProps.unshift({
    id,
    key: `$${id}$`,
    defaultValue: parsedTextProp.text,
    label: "",
    description: "",
  });

  replacedBahaCode =
    replacedBahaCode.substring(0, parsedTextProp.startIndex) +
    `$${id}$` +
    replacedBahaCode.substring(
      parsedTextProp.startIndex + parsedTextProp.length
    );
}

// Part 2: Image Props
const imageProps = [];
const parsedImageProps = [
  ...replacedBahaCode.matchAll(/\[img=([^\s\]]+)[^\]]*\]/g),
]
  .map((result, i) => ({
    text: result[1],
    startIndex: result.index + 5,
    length: result[1].length,
    order: i,
  }))
  .reverse();

for (const parsedImageProp of parsedImageProps) {
  const id = `img_${nanoid(8)}`;
  imageProps.unshift({
    id,
    key: `$${id}$`,
    defaultValue: parsedImageProp.text,
    label: "",
    description: "",
  });

  replacedBahaCode =
    replacedBahaCode.substring(0, parsedImageProp.startIndex) +
    `$${id}$` +
    replacedBahaCode.substring(
      parsedImageProp.startIndex + parsedImageProp.length
    );
}

// Part 3: Color Props
const colorProps = [];
const parsedColorProps = [...replacedBahaCode.matchAll(/(#[a-fA-F0-9]{6})/g)]
  .map((result, i) => ({
    text: result[1],
    startIndex: result.index,
    length: result[1].length,
    order: i,
  }))
  .reverse();

for (const parsedColorProp of parsedColorProps) {
  const foundSameColor = colorProps.find(
    ({ defaultValue }) => defaultValue === parsedColorProp.text
  );
  const id = foundSameColor?.id ?? `color_${nanoid(8)}`;

  if (!foundSameColor) {
    colorProps.unshift({
      id,
      key: `$${id}$`,
      defaultValue: parsedColorProp.text,
      label: "",
      description: "",
    });
  }

  replacedBahaCode =
    replacedBahaCode.substring(0, parsedColorProp.startIndex) +
    `$${id}$` +
    replacedBahaCode.substring(
      parsedColorProp.startIndex + parsedColorProp.length
    );
}

fs.writeFileSync(
  "./dist.json",
  JSON.stringify(
    {
      textProps,
      imageProps,
      colorProps,
      bahaCode: replacedBahaCode,
    },
    null,
    2
  )
);