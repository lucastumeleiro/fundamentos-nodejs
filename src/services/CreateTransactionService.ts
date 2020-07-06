import TransactionsRepository from '../repositories/TransactionsRepository';
import Transaction from '../models/Transaction';

interface requestDTO {
  title: string;
  value: number;
  type: 'income' | 'outcome';
}

class CreateTransactionService {
  private transactionsRepository: TransactionsRepository;

  constructor(transactionsRepository: TransactionsRepository) {
    this.transactionsRepository = transactionsRepository;
  }

  public execute({ title, value, type }: requestDTO): Transaction {
    if (!['income', 'outcome'].includes(type)) {
      throw new Error('Transaction type is invalid!');
    }

    const { total } = this.transactionsRepository.getBalance();

    if (type === 'outcome') {
      if (total < value) {
        throw Error('The transaction amount exceeds the account total');
      }
    }

    const transaction = this.transactionsRepository.create({
      title,
      value,
      type,
    });

    return transaction;
  }
}

export default CreateTransactionService;
