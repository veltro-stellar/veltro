use criterion::{black_box, criterion_group, criterion_main, Criterion};
use soroban_sdk::{testutils::Address as _, Address, BytesN, Env};
use veltro::{VeltroContract, VeltroContractClient};

fn setup_veltro(env: &Env) -> (VeltroContractClient, Address) {
    let contract_id = env.register_contract(None, VeltroContract);
    let client = VeltroContractClient::new(env, &contract_id);
    let admin = Address::generate(env);
    env.mock_all_auths();
    client.initialize(&admin);
    (client, admin)
}

fn make_hash(env: &Env, seed: u8) -> BytesN<32> {
    BytesN::from_array(env, &[seed; 32])
}

fn bench_veltro_submit(c: &mut Criterion) {
    let env = Env::default();
    let (client, admin) = setup_veltro(&env);
    let mut epoch = 1u64;

    c.bench_function("veltro::submit_snapshot", |b| {
        b.iter(|| {
            let hash = make_hash(&env, (epoch % 255) as u8);
            client
                .submit_snapshot(black_box(&epoch), black_box(&hash), black_box(&admin))
                .unwrap();
            epoch += 1;
        })
    });
}

fn bench_veltro_get(c: &mut Criterion) {
    let env = Env::default();
    let (client, admin) = setup_veltro(&env);

    for epoch in 1u64..=100 {
        let hash = make_hash(&env, (epoch % 255) as u8);
        client.submit_snapshot(&epoch, &hash, &admin).unwrap();
    }

    c.bench_function("veltro::get_snapshot", |b| {
        b.iter(|| client.get_snapshot(black_box(&50u64)).unwrap())
    });
}

fn bench_veltro_latest(c: &mut Criterion) {
    let env = Env::default();
    let (client, admin) = setup_veltro(&env);

    for epoch in 1u64..=50 {
        let hash = make_hash(&env, (epoch % 255) as u8);
        client.submit_snapshot(&epoch, &hash, &admin).unwrap();
    }

    c.bench_function("veltro::latest_snapshot", |b| {
        b.iter(|| client.latest_snapshot().unwrap())
    });
}

criterion_group!(
    veltro_benches,
    bench_veltro_submit,
    bench_veltro_get,
    bench_veltro_latest,
);

criterion_main!(veltro_benches);
