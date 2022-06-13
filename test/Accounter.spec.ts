import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { expect } from 'chai';
import { BigNumber } from 'ethers';
import { ethers } from 'hardhat';
// eslint-disable-next-line node/no-missing-import
import { Accounter } from '../typechain';
// eslint-disable-next-line node/no-missing-import
import { ether } from '../utils/unitsUtils';

describe('Accounter', function () {
    let subjectContract: Accounter;
    let bob: SignerWithAddress;
    let alice: SignerWithAddress;
    let carol: SignerWithAddress;
    let nikita: SignerWithAddress;
    let arkadii: SignerWithAddress;
    let funder: SignerWithAddress;
    const getNextNonce = async () => (await subjectContract.nonce()).add(1);
    const getDigest = async (nonce: BigNumber, amount: BigNumber, to: string) => {
        const txn = { amount, to };
        const encoded = ethers.utils.defaultAbiCoder.encode(['tuple(uint256,address)'], [[txn.amount, txn.to]]);
        const encodedWithNonce = ethers.utils.solidityPack(['bytes', 'uint256'], [encoded, nonce]);

        return ethers.utils.keccak256(encodedWithNonce);
    };
    const subjectMethod = async (
        signer: SignerWithAddress,
        nonce: BigNumber,
        amount: BigNumber,
        to: string,
        signatures: string[],
    ) => {
        const txn = { amount, to };
        await subjectContract.connect(signer).withdrawETH(txn, nonce, signatures, { gasPrice: 0 });
    };

    beforeEach('', async function () {
        const signers = await ethers.getSigners();
        [bob, alice, carol, nikita, arkadii, funder] = signers;

        subjectContract = await (
            await ethers.getContractFactory('Accounter')
        ).deploy([
            { wallet: alice.address, salaryUSD: 1000 },
            { wallet: bob.address, salaryUSD: 1000 },
            { wallet: carol.address, salaryUSD: 1000 },
            { wallet: nikita.address, salaryUSD: 10000 },
            { wallet: arkadii.address, salaryUSD: 100 },
        ]);
        await subjectContract.deployed();
    });

    it('Normal expected operation of contract', async function () {
        const amount = ether(1);
        await funder.sendTransaction({ value: amount, to: subjectContract.address });
        const nonce = await getNextNonce();
        const digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, alice, carol, nikita, arkadii];
        signers.sort((x, y) => (x.address > y.address ? 1 : -1));
        const signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }

        const initBobETHBalance = await ethers.provider.getBalance(bob.address);
        await subjectMethod(bob, nonce, amount, bob.address, signatures);
        const finalBobETHBalance = await ethers.provider.getBalance(bob.address);

        expect(finalBobETHBalance.sub(initBobETHBalance)).to.be.eq(amount);
    });

    it('Normal expected operation of contract (to be reverted)', async function () {
        const amount = ether(1);
        await funder.sendTransaction({
            value: amount,
            to: subjectContract.address,
        });
        const nonce = await getNextNonce();
        const digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, bob, bob];
        const signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }

        await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith(
            'possible duplicate',
        );
    });

    it('revert - not enough singers', async function () {
        const amount = ether(1);
        await funder.sendTransaction({
            value: amount,
            to: subjectContract.address,
        });
        const nonce = await getNextNonce();
        const digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, alice];
        signers.sort((x, y) => (x.address > y.address ? 1 : -1));
        const signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }

        await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith(
            'not enough signers',
        );
    });

    it('revert - signer is not registered', async function () {
        const amount = ether(1);
        await funder.sendTransaction({ value: amount, to: subjectContract.address });
        const nonce = await getNextNonce();
        const digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, funder, alice]; // funder is not part of consortium
        signers.sort((x, y) => (x.address > y.address ? 1 : -1));
        const signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }

        await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith(
            'not part of consortium',
        );
    });

    it('revert - unordered signers', async function () {
        const amount = ether(1);
        await funder.sendTransaction({ value: amount, to: subjectContract.address });
        const nonce = await getNextNonce();
        const digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, carol, alice];
        signers.sort((x, y) => (x.address > y.address ? 1 : -1));
        // swap last 2 to ensure unordered list
        const tmp = signers[2];
        signers[2] = signers[1];
        signers[1] = tmp;

        const signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }

        await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith(
            'possible duplicate',
        );
    });

    it('revert - not enough balance ', async function () {
        const amount = ether(1);
        await funder.sendTransaction({ value: amount.sub(1), to: subjectContract.address });
        const nonce = await getNextNonce();
        const digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, carol, alice];
        signers.sort((x, y) => (x.address > y.address ? 1 : -1));

        const signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }

        await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith(
            'Transfer not fulfilled',
        );
    });

    it('revert - nonce not incremented ', async function () {
        const amount = ether(1);
        await funder.sendTransaction({ value: amount.mul(2), to: subjectContract.address });
        const nonce = await getNextNonce();
        let digest = await getDigest(nonce, amount, bob.address);

        const signers = [bob, carol, alice];
        signers.sort((x, y) => (x.address > y.address ? 1 : -1));

        let signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }
        await subjectMethod(bob, nonce, amount, bob.address, signatures);

        digest = await getDigest(nonce, amount, bob.address);
        signatures = [];
        for (const signer of signers) {
            const sign = await signer.signMessage(ethers.utils.arrayify(digest));
            signatures.push(sign);
        }
        await expect(subjectMethod(bob, nonce, amount, bob.address, signatures)).to.be.revertedWith(
            'nonce already used',
        );
    });
});
