import bcrypt from 'bcrypt';
import { User } from '../models/User';
import { Forum } from '../models/Forum';
import { Thread } from '../models/Thread';
import { Comment } from '../models/Comment';
import { Role } from '../models/Role';
import logger from '../config/logger';

export const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('Starting database seeding...');

    // Create roles first
    const userRole = await Role.create({ name: 'user' });
    const moderatorRole = await Role.create({ name: 'moderator' });
    const adminRole = await Role.create({ name: 'admin' });

    // Create users
    const users = [
      { firstName: 'Jan', lastName: 'Kowalski', username: 'janek_k', email: 'jan.kowalski@example.com', age: 34, password: 'Haslo123!' },
      { firstName: 'Anna', lastName: 'Nowak', username: 'anowak99', email: 'anna.nowak@test.pl', age: 25, password: 'P@ssword88' },
      { firstName: 'Piotr', lastName: 'Wiśniewski', username: 'p_wisniewski', email: 'piotr.w@domena.com', age: 42, password: 'Qwerty!2024' },
      { firstName: 'Katarzyna', lastName: 'Wójcik', username: 'kacha_w', email: 'k.wojcik@mail.org', age: 29, password: 'K4t4rzyn4#' },
      { firstName: 'Michał', lastName: 'Kamiński', username: 'mkaminski', email: 'michal.kaminski@fake.net', age: 38, password: 'SuperTajne1' },
      { firstName: 'Agnieszka', lastName: 'Zielińska', username: 'aga_z', email: 'agnieszka.z@serwer.pl', age: 31, password: 'Z1elinska$' },
      { firstName: 'Tomasz', lastName: 'Lewandowski', username: 'tommylew', email: 't.lewandowski@biuro.com', age: 45, password: 'Lewy1979!' },
      { firstName: 'Magdalena', lastName: 'Szymańska', username: 'madzia_s', email: 'm.szymanska@poczta.fm', age: 22, password: 'Lato2025*' },
      { firstName: 'Paweł', lastName: 'Dąbrowski', username: 'pdabrowski', email: 'pawel.dab@firma.xy', age: 50, password: 'P@wel5050' },
      { firstName: 'Monika', lastName: 'Kozłowska', username: 'moni_koz', email: 'm.kozlowska@webmail.pl', age: 27, password: 'K0zlowsk4!' },
    ];

    const createdUsers: User[] = [];
    for (const userData of users) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await User.create({
        username: userData.username,
        email: userData.email,
        password_hash: hashedPassword,
        date_of_birth: new Date(new Date().getFullYear() - userData.age, 0, 1),
        role_id: userRole.id,
      });
      createdUsers.push(user);
    }

    logger.info(`Created ${createdUsers.length} users`);

    // Map usernames to user IDs
    const userMap: { [key: string]: number } = {};
    createdUsers.forEach(user => {
      userMap[user.username] = user.user_id;
    });

    // Create forums
    const japaneseCuisine = await Forum.create({
      title: 'Japanese Cuisine',
      description: 'Discussion about Japanese food, recipes, and restaurants',
      created_by: userMap['janek_k'],
    });

    const handcraft = await Forum.create({
      title: 'Handcraft',
      description: 'DIY projects, woodworking, and crafts',
      created_by: userMap['mkaminski'],
    });

    const plants = await Forum.create({
      title: 'Plants',
      description: 'Everything about indoor and outdoor plants',
      created_by: userMap['anowak99'],
    });

    logger.info('Created 3 forums');

    // Create threads and comments for Japanese Cuisine
    const thread1 = await Thread.create({
      title: 'The secret to perfect Tonkotsu Ramen broth',
      description: "Hi everyone! I've been trying to get that characteristic creamy and sticky Tonkotsu broth for three attempts now, but it keeps coming out too watery. I boil pork bones for about 8 hours on high heat. Should I boil them longer, or maybe add pork trotters for collagen?",
      forum_id: japaneseCuisine.forum_id,
      user_id: userMap['janek_k'],
    });

    await Comment.create({
      content: "Definitely add trotters! It's the collagen that makes the soup thick. I usually mix pork loin bones with trotters in a 2:1 ratio. And boil for a minimum of 12 hours, 8 is a bit too short for full extraction.",
      thread_id: thread1.thread_id,
      user_id: userMap['p_wisniewski'],
    });

    await Comment.create({
      content: 'I had this problem too. It\'s also important to boil off the scum vigorously at the beginning and change the water, then maintain a "rolling boil" so the fat emulsifies with the water. Good luck!',
      thread_id: thread1.thread_id,
      user_id: userMap['madzia_s'],
    });

    const thread2 = await Thread.create({
      title: 'Where to buy fresh wasabi in Poland?',
      description: "Do any of you know where I can get real wasabi root? I'm tired of those green-dyed horseradish pastes. I'd like to grate fresh wasabi for sushi for a special occasion.",
      forum_id: japaneseCuisine.forum_id,
      user_id: userMap['tommylew'],
    });

    await Comment.create({
      content: 'Check online Asian food stores, sometimes they stock it, but the price is killer (approx. 300-400 PLN/kg). I recently saw it in premium delis in Warsaw, but it sells out fast.',
      thread_id: thread2.thread_id,
      user_id: userMap['anowak99'],
    });

    // Create threads and comments for Handcraft
    const thread3 = await Thread.create({
      title: 'Renovating an old dresser - which sandpaper?',
      description: "I found a great 60s dresser by the trash. I want to remove the old high-gloss varnish and leave the raw wood (I think it's walnut). What grit sandpaper should I start with so I don't ruin the veneer? I'm afraid of sanding right through it.",
      forum_id: handcraft.forum_id,
      user_id: userMap['mkaminski'],
    });

    await Comment.create({
      content: "If it's veneer, I beg you, don't use a belt sander! Only a random orbital sander or do it by hand. I would start gently with 180 grit. If the varnish is thick and hard (chemically hardened), it's better to use a paint stripper gel first, and only sand at the very end.",
      thread_id: thread3.thread_id,
      user_id: userMap['pdabrowski'],
    });

    await Comment.create({
      content: 'I agree with Paul. The veneer on furniture from that era can be very thin. Once you clean it, I recommend hard wax oil instead of varnish – it will bring out the grain beautifully.',
      thread_id: thread3.thread_id,
      user_id: userMap['kacha_w'],
    });

    const thread4 = await Thread.create({
      title: 'Macrame for beginners - which cord?',
      description: "I want to make my first plant hanger. Which cord should I choose to start? Braided cotton or twisted? And what thickness is best so my fingers don't hurt and the knots are visible?",
      forum_id: handcraft.forum_id,
      user_id: userMap['aga_z'],
    });

    await Comment.create({
      content: 'For the start, take a 5mm braided cord (the one with a core). Twisted looks beautiful because you can comb out the ends, but it\'s harder to work with because it unravels while tying. Braided is more forgiving of mistakes.',
      thread_id: thread4.thread_id,
      user_id: userMap['moni_koz'],
    });

    // Create threads and comments for Plants
    const thread5 = await Thread.create({
      title: 'Monstera Variegata - brown spots on white parts',
      description: 'Help! I bought my dream Monstera Variegata cutting. After a week, the white parts of the leaves started turning brown and drying out. The plant is one meter from a south-facing window, and I water it when the top layer is dry. What am I doing wrong?',
      forum_id: plants.forum_id,
      user_id: userMap['anowak99'],
    });

    await Comment.create({
      content: 'Unfortunately, this is typical for variegatas. Those white parts have no chlorophyll and are very sensitive. It might have too little humidity in the air. Do you have a humidifier? It should be at min. 60%.',
      thread_id: thread5.thread_id,
      user_id: userMap['janek_k'],
    });

    await Comment.create({
      content: "Check the roots too. If the browning starts from the edges, it's humidity, but if the spots are soft and mushy, it could be overwatering and fungus.",
      thread_id: thread5.thread_id,
      user_id: userMap['tommylew'],
    });

    await Comment.create({
      content: 'I would add supplemental lighting. One meter from a window in winter is like a darkroom for it. The white parts die because the plant rejects "parasitic" tissue that doesn\'t produce energy when there isn\'t enough light.',
      thread_id: thread5.thread_id,
      user_id: userMap['aga_z'],
    });

    await Comment.create({
      content: "Confirming what Aga wrote. Buy a grow light bulb. And don't mist the leaves! That often causes fungal infections on the white parts.",
      thread_id: thread5.thread_id,
      user_id: userMap['pdabrowski'],
    });

    logger.info('Created 5 threads with comments');
    logger.info('Database seeding completed successfully!');
  } catch (error) {
    logger.error('Error seeding database:', error);
    throw error;
  }
};
