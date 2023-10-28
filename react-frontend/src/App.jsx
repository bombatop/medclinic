import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css'; 

import Header from './pages/Header';

import Patient from './pages/Patient';
import Treatment from './pages/Treatment';
import Doctor from './pages/Doctor';
import Journal from './pages/Journal';

import Patients from './pages/Patients';
import Treatments from './pages/Treatments';
import Doctors from './pages/Doctors';
import Journals from './pages/Journals';

import NewPatient from './pages/NewPatient';
import NewDoctor from './pages/NewDoctor'
import NewTreatment from './pages/NewTreatment';
import NewJournal from './pages/NewJournal';

import ProfitsReport from './pages/ProfitsReport';
import ErrorPage from './pages/ErrorPage';

function App() {
    return (
        <div>
            <link rel="icon" href="favicon.png" type="image/x-icon"></link>
            <BrowserRouter>
                <Header />
                <Routes>
                    <Route path='/patient/:patientId' element={<Patient />} />
                    <Route path='/treatment/:treatmentId' element={<Treatment />} />
                    <Route path='/doctor/:doctorId' element={<Doctor />} />
                    <Route path='/journal/:journalId' element={<Journal />} />

                    <Route path='/treatments' element={<Treatments />} />
                    <Route path='/patients' element={<Patients />} />
                    <Route path='/doctors' element={<Doctors />} />
                    <Route path='/journals' element={<Journals />} />
                    <Route path='/' element={<Journals />} />

                    <Route path='/newPatient' element={<NewPatient />} />
                    <Route path='/newDoctor' element={<NewDoctor />} />
                    <Route path='/newTreatment' element={<NewTreatment />} />
                    <Route path='/newJournal' element={<NewJournal/>} />

                    <Route path='/report' element={<ProfitsReport />} />

                    <Route path='*' element={<ErrorPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;