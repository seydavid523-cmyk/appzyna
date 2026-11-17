import { NextResponse } from 'next/server';
import { getStoreApp } from '@/lib/v3-data';

function crc32(input: Buffer) {
  let crc = 0xffffffff;
  for (let index = 0; index < input.length; index += 1) {
    const byte = input[index];
    crc ^= byte;
    for (let bit = 0; bit < 8; bit += 1) crc = (crc >>> 1) ^ (0xedb88320 & -(crc & 1));
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function createZip(files: Array<{ name: string; content: string }>) {
  const locals: Buffer[] = [];
  const centrals: Buffer[] = [];
  let offset = 0;
  for (const file of files) {
    const name = Buffer.from(file.name, 'utf8');
    const data = Buffer.from(file.content, 'utf8');
    const crc = crc32(data);
    const local = Buffer.alloc(30 + name.length + data.length);
    local.writeUInt32LE(0x04034b50, 0);
    local.writeUInt16LE(20, 4);
    local.writeUInt16LE(0x800, 6);
    local.writeUInt16LE(0, 8);
    local.writeUInt32LE(crc, 14);
    local.writeUInt32LE(data.length, 18);
    local.writeUInt32LE(data.length, 22);
    local.writeUInt16LE(name.length, 26);
    name.copy(local, 30);
    data.copy(local, 30 + name.length);
    locals.push(local);

    const central = Buffer.alloc(46 + name.length);
    central.writeUInt32LE(0x02014b50, 0);
    central.writeUInt16LE(20, 4);
    central.writeUInt16LE(20, 6);
    central.writeUInt16LE(0x800, 8);
    central.writeUInt16LE(0, 10);
    central.writeUInt32LE(crc, 16);
    central.writeUInt32LE(data.length, 20);
    central.writeUInt32LE(data.length, 24);
    central.writeUInt16LE(name.length, 28);
    central.writeUInt32LE(offset, 42);
    name.copy(central, 46);
    centrals.push(central);
    offset += local.length;
  }
  const centralDirectory = Buffer.concat(centrals);
  const end = Buffer.alloc(22);
  end.writeUInt32LE(0x06054b50, 0);
  end.writeUInt16LE(files.length, 8);
  end.writeUInt16LE(files.length, 10);
  end.writeUInt32LE(centralDirectory.length, 12);
  end.writeUInt32LE(offset, 16);
  return Buffer.concat([...locals, centralDirectory, end]);
}

export async function GET(_: Request, { params }: { params: { slug: string } }) {
  const app = getStoreApp(params.slug);
  if (!app) return NextResponse.json({ error: 'App not found' }, { status: 404 });
  const sourceWebsite = app.websiteUrl || 'Add your website URL in the Appzyna creator dashboard.';
  const manifest = {
    name: app.name,
    slug: app.slug,
    category: app.category,
    description: app.longDescription,
    sourceWebsite,
    creator: app.creatorName,
    creatorProfile: `/creator/${app.creatorUsername}`,
    generatedBy: 'Appzyna by King Tech',
    downloadedAt: new Date().toISOString(),
  };
  const readme = `# ${app.name}\n\nThis Appzyna package was downloaded from the Appzyna Store.\n\n- Category: ${app.category}\n- Creator: ${app.creatorName}\n- Source website: ${sourceWebsite}\n\nOpen the source website to continue using the original web experience. The included appzyna-manifest.json contains the Store listing metadata.\n`;
  const zip = createZip([
    { name: 'appzyna-manifest.json', content: JSON.stringify(manifest, null, 2) },
    { name: 'README.md', content: readme },
  ]);
  return new NextResponse(zip as unknown as BodyInit, {
    status: 200,
    headers: {
      'Content-Type': 'application/zip',
      'Content-Disposition': `attachment; filename="${app.slug}-appzyna.zip"`,
      'Content-Length': String(zip.length),
      'Cache-Control': 'no-store',
    },
  });
}
