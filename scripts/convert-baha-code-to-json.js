import { nanoid } from "nanoid";
import fs from "fs";

const SOURCE_BAHA_CODE = `[div][table width=98% cellspacing=1 cellpadding=1 align=center]
[tr]
[td height=50 width=50 bgcolor=transparent rowspan=4][img=https://truth.bahamut.com.tw/s01/202001/1d372c07129b2b8b7277f7de580e6b5d.JPG height=120 width=120][/td]
[td colspan=3 rowspan=2 bgcolor=#3366FF align=center][color=#ffffff][size=4][b]『星導爵』[/b][/size][/color][/td]
[/tr]
[tr]
[td colspan=2 align=center][size=4][color=#FF6600][b]LV.88[/b][/color][/size][/td]
[/tr]
[tr]
[td width=60 bgcolor=transparent colspan=3 align=center][b][color=#ccffff][size=4]愛麗絲．白銀[/size][/color][/b][/td]
[td width=70 colspan=2 bgcolor=transparent align=center][div][color=#C0C0C0][url=http://guild.gamer.com.tw/guildMemberL.php?gsn=3014&su=apaqi1991#apaqi1991][b][color=#99CCFF]✧[/color][/b][/url] [b][color=#99CCFF][size=2]3771[/size][/color][/b][size=2]／[/size][b][color=#99CCFF][size=2]9999[/size][/color][/b][/color][/div][div][url=https://ref.gamer.com.tw/redir.php?url=https%3A%2F%2Fguild.gamer.com.tw%2Fwiki.php%3Fsn%3D3014%26n%3D01.【鑽石系統】][color=#FF0000][b][size=3]⦡[/size][/b][/color][/url][b][color=#FFFFCC][size=2]12[/size][/color][/b][size=2]／[/size][b][color=#FFFFCC][size=2]50[/size][/color][/b][/div][div][size=2]([url=https://home.gamer.com.tw/creationEdit1.php?sn=3081762][color=#0066CC][size=2]調整[/size][/color][/url][/size])[/div][div][size=2][color=#C0C0C0]晉升－[/color][color=#99ccff][b]2400[/b][/color]／[color=#ffff99][b]12[/b][/color][/size][/div][/td]
[/tr]
[/table][/div][div]
[/div][div][table width=98% align=center cellspacing=1 cellpadding=1]
[tr]
[td width=90 bgcolor=#FFFFFF align=center][color=#000000][size=3]性別[/size][/color][/td]
[td width=180 bgcolor=#000000 align=center][color=#FFFFFF][size=2]女性[/size][/color][/td]
[td width=90 bgcolor=#FFFFFF align=center][color=#000000][size=3]年齡[/size][/color][/td]
[td width=180 bgcolor=#000000 align=center][color=#FFFFFF][size=2]11(+3*)[/size][/color][/td]
[/tr]
[tr]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]種族[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#FFFFFF][size=2]魔造魔－非天(傳奇魔物)[/size][/color][/td]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]居住[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#ffffff][size=2]王國的據點－1號房[/size][/color][/td]
[/tr]
[tr]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]生日[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#FFFFFF][size=2]9/16[/size][/color][/td]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]領地[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#FFFFFF][size=2][url=https://home.gamer.com.tw/creationDetail.php?sn=4858073]白塵嶺[/url][/size][/color][/td]
[/tr]
[tr]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]身高/體重[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#FFFFFF][size=2]145cm/80kg[/size][/color][/td]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]陣營[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#FFFFFF][size=2]中立善良[/size][/color][/td]
[/tr]
[tr]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]三圍[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#FFFFFF][size=2]B73 / W53 / H75[/size][/color][/td]
[td bgcolor=#FFFFFF align=center][color=#000000][size=3]屬性[/size][/color][/td]
[td bgcolor=#000000 align=center][color=#ffffff][size=2]蘿莉、呆毛、元氣[/size][/color][/td]
[/tr]
[/table][/div]`;

let replacedBahaCode = SOURCE_BAHA_CODE;

// Part 1: Text Props
const textProps = [];
const parsedTextProps = [
  ...replacedBahaCode.matchAll(/\[size=[123456]\]([^\]]*)\[\/size\]/g),
  ...replacedBahaCode.matchAll(/\[b\]([^\]]*)\[\/b\]/g),
]
  .sort((a, b) => a.index - b.index)
  .map((result, i) => ({
    text: result[1],
    startIndex: result.index + result[0].indexOf("]") + 1,
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
    category: "text",
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
  const id = `url_${nanoid(8)}`;
  imageProps.unshift({
    id,
    key: `$${id}$`,
    defaultValue: parsedImageProp.text,
    label: "",
    description: "",
    category: "url",
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
      category: "color",
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
      props: [...textProps, ...imageProps, ...colorProps],
      bahaCode: replacedBahaCode,
      properties: {
        name: "未命名模板",
        author: "",
        briefing: "",
        description: "",
        demoUrl: "",
        previewImageUrl: "",
        imageUrls: [],
        tags: "",
      },
    },
    null,
    2
  )
);
