import React from 'react';
import { Link } from 'react-router-dom';

const TopicsList = () => {
    const topics = [
        {
            section: "Нумерация и система счисления",
            topics: [
                "Нумерация натуральных чисел",
                "Сравнение чисел",
                "Системы счисления"
            ]
        },
        {
            section: "Арифметические действия с натуральными числами",
            topics: [
                "Сложение и вычитание",
                "Умножение и деление",
                "Свойства арифметических действий"
            ]
        },
        {
            section: "Дроби",
            topics: [
                "Понятие дроби",
                "Сравнение дробей",
                "Арифметические действия с дробями"
            ]
        },
        {
            section: "Десятичные дроби",
            topics: [
                "Понятие десятичной дроби",
                "Сравнение десятичных дробей",
                "Арифметические действия с десятичными дробями"
            ]
        },
        {
            section: "Геометрические фигуры и их свойства",
            topics: [
                "Треугольники",
                "Четырехугольники",
                "Круг и окружность"
            ]
        },
        {
            section: "Измерение величин",
            topics: [
                "Длина",
                "Площадь",
                "Объем"
            ]
        },
        {
            section: "Решение уравнений и неравенств",
            topics: [
                "Линейные уравнения",
                "Линейные неравенства",
                "Системы уравнений"
            ]
        },
        {
            section: "Задачи на логику и сообразительность",
            topics: [
                "Логические задачи",
                "Задачи на сообразительность"
            ]
        },
        {
            section: "Порядок выполнения действий",
            topics: [
                "Последовательность действий",
                "Скобки и их использование"
            ]
        },
        {
            section: "Решение текстовых задач",
            topics: [
                "Простые задачи",
                "Сложные задачи"
            ]
        }
    ];

    return (
        <div className="container my-5">
            <h1 className="mb-4">Math Topics</h1>
            {topics.map(section => (
                <div key={section.section}>
                    <h2>{section.section}</h2>
                    <ul className="list-group mb-4">
                        {section.topics.map(topic => (
                            <li key={topic} className="list-group-item">
                                <Link to={`/generate-test/${encodeURIComponent(topic)}`}>{topic}</Link>
                            </li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    );
};

export default TopicsList;
